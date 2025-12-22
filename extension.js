const vscode = require('vscode');
const https = require('https');
const { transliterate } = require('./transliterate');

let isEnabled = false;
let statusBarItem;
let pendingWord = '';
let pendingRange = null;

/**
 * Get suggestions from Google Transliteration API
 */
function getGoogleSuggestions(text) {
    return new Promise((resolve) => {
        if (!text || text.length < 1) {
            resolve(null);
            return;
        }

        const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=bn-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8`;

        const req = https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result[0] === 'SUCCESS' && result[1] && result[1][0] && result[1][0][1]) {
                        resolve(result[1][0][1]);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        });

        req.on('error', () => {
            resolve(null);
        });

        req.setTimeout(3000, () => {
            req.destroy();
            resolve(null);
        });
    });
}

/**
 * Show QuickPick with suggestions
 */
async function showSuggestions(editor, word, wordRange) {
    const suggestions = await getGoogleSuggestions(word);

    let items = [];

    if (suggestions && suggestions.length > 0) {
        items = suggestions.map((s, i) => ({
            label: s,
            description: `Google #${i + 1}`,
            picked: i === 0
        }));
    } else {
        // Fallback to offline
        const offline = transliterate(word);
        if (offline !== word) {
            items = [{
                label: offline,
                description: '(offline)',
                picked: true
            }];
        }
    }

    if (items.length === 0) return;

    // If only one suggestion, use it directly
    if (items.length === 1) {
        await editor.edit(editBuilder => {
            editBuilder.replace(wordRange, items[0].label);
        });
        return;
    }

    // Show QuickPick for multiple suggestions
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: `Select Bengali for "${word}"`,
        title: 'বাংলা Suggestions'
    });

    if (selected) {
        await editor.edit(editBuilder => {
            editBuilder.replace(wordRange, selected.label);
        });
    }
}

/**
 * Activate the extension
 */
function activate(context) {
    console.log('Bangla Input extension activated');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'banglaInput.toggle';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Register toggle command
    let toggleCommand = vscode.commands.registerCommand('banglaInput.toggle', () => {
        isEnabled = !isEnabled;
        updateStatusBar();
        vscode.window.showInformationMessage(`Bangla Input: ${isEnabled ? 'ON ✓' : 'OFF'}`);
    });
    context.subscriptions.push(toggleCommand);

    // Register convert command - converts word before cursor with suggestions
    let convertCommand = vscode.commands.registerCommand('banglaInput.convert', async () => {
        if (!isEnabled) {
            vscode.window.showWarningMessage('Bangla Input is OFF. Press Ctrl+Alt+B to enable.');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line);
        const textBeforeCursor = line.text.substring(0, position.character);
        const match = textBeforeCursor.match(/[a-zA-Z0-9]+$/);

        if (!match) {
            vscode.window.showInformationMessage('No English word found before cursor');
            return;
        }

        const word = match[0];
        const wordStart = position.character - word.length;
        const wordRange = new vscode.Range(
            position.line, wordStart,
            position.line, position.character
        );

        await showSuggestions(editor, word, wordRange);
    });
    context.subscriptions.push(convertCommand);

    // Type interception for auto-convert on space
    let typeDisposable = vscode.commands.registerCommand('type', async (args) => {
        if (!isEnabled) {
            await vscode.commands.executeCommand('default:type', args);
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            await vscode.commands.executeCommand('default:type', args);
            return;
        }

        const char = args.text;

        // On space/enter/punctuation, convert word and show suggestions
        if (char === ' ' || char === '\n') {
            const position = editor.selection.active;
            const line = editor.document.lineAt(position.line);
            const textBeforeCursor = line.text.substring(0, position.character);
            const match = textBeforeCursor.match(/[a-zA-Z0-9]+$/);

            if (match) {
                const word = match[0];
                const wordStart = position.character - word.length;
                const wordRange = new vscode.Range(
                    position.line, wordStart,
                    position.line, position.character
                );

                // Get first Google suggestion and replace
                const suggestions = await getGoogleSuggestions(word);
                if (suggestions && suggestions.length > 0) {
                    await editor.edit(editBuilder => {
                        editBuilder.replace(wordRange, suggestions[0]);
                    });
                } else {
                    // Fallback to offline
                    const offline = transliterate(word);
                    if (offline !== word) {
                        await editor.edit(editBuilder => {
                            editBuilder.replace(wordRange, offline);
                        });
                    }
                }
            }

            await vscode.commands.executeCommand('default:type', args);
            return;
        }

        // Regular typing
        await vscode.commands.executeCommand('default:type', args);
    });
    context.subscriptions.push(typeDisposable);
}

/**
 * Update status bar
 */
function updateStatusBar() {
    if (isEnabled) {
        statusBarItem.text = '$(globe) বাংলা ON';
        statusBarItem.tooltip = 'Bangla Input ON - Ctrl+. for suggestions';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '$(globe) বাংলা OFF';
        statusBarItem.tooltip = 'Bangla Input OFF - Click to enable';
        statusBarItem.backgroundColor = undefined;
    }
}

function deactivate() {
    if (statusBarItem) statusBarItem.dispose();
}

module.exports = { activate, deactivate };
