const vscode = require('vscode');
const https = require('https');
const { transliterate } = require('./transliterate');

let autoMode = false;  // Auto-correct mode (off by default, manual mode)
let statusBarItem;

// Bengali punctuation mappings
const PUNCTUATION_MAP = {
    '.': '।',   // dari
};

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
 * Show QuickPick with suggestions and number key shortcuts
 */
async function showSuggestions(editor, word, wordRange) {
    // Check for punctuation first - direct replace, no picker needed
    if (PUNCTUATION_MAP[word]) {
        await editor.edit(editBuilder => {
            editBuilder.replace(wordRange, PUNCTUATION_MAP[word]);
        });
        return;
    }

    const suggestions = await getGoogleSuggestions(word);

    let items = [];

    if (suggestions && suggestions.length > 0) {
        items = suggestions.map((s, i) => ({
            label: s,
            description: `[${i + 1}] Google`,
            index: i
        }));
    } else {
        // Fallback to offline
        const offline = transliterate(word);
        if (offline !== word) {
            items = [{
                label: offline,
                description: '[1] offline',
                index: 0
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

    // Show QuickPick with number key support
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = items;
    quickPick.placeholder = `Select Bengali for "${word}" (press 1-${items.length} or Enter)`;
    quickPick.title = 'বাংলা Suggestions';

    return new Promise((resolve) => {
        // Handle number key selection
        quickPick.onDidChangeValue((value) => {
            const num = parseInt(value);
            if (num >= 1 && num <= items.length) {
                editor.edit(editBuilder => {
                    editBuilder.replace(wordRange, items[num - 1].label);
                });
                quickPick.hide();
                resolve();
            }
        });

        quickPick.onDidAccept(() => {
            const selected = quickPick.selectedItems[0];
            if (selected) {
                editor.edit(editBuilder => {
                    editBuilder.replace(wordRange, selected.label);
                });
            }
            quickPick.hide();
            resolve();
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
            resolve();
        });

        quickPick.show();
    });
}

/**
 * Activate the extension
 */
function activate(context) {
    console.log('Bangla Input extension activated');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'banglaInput.toggleAutoMode';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Register auto mode toggle command (Cmd+Shift+G) - Toggle auto-correct ON/OFF
    let toggleAutoModeCommand = vscode.commands.registerCommand('banglaInput.toggleAutoMode', () => {
        autoMode = !autoMode;
        updateStatusBar();
        vscode.window.showInformationMessage(`Bangla Auto-correct: ${autoMode ? 'ON (converts on Space)' : 'OFF (use Cmd+G)'}`);
    });
    context.subscriptions.push(toggleAutoModeCommand);

    // Register convert command (Cmd+G) - converts selected text or word before cursor with suggestions
    let convertCommand = vscode.commands.registerCommand('banglaInput.convert', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        let word, wordRange;

        // Check if there's a selection
        if (!selection.isEmpty) {
            // Use selected text
            word = editor.document.getText(selection);
            wordRange = selection;
        } else {
            // Fallback: get word before cursor
            const position = editor.selection.active;
            const line = editor.document.lineAt(position.line);
            const textBeforeCursor = line.text.substring(0, position.character);
            // Match English words OR punctuation (dot for dari)
            const match = textBeforeCursor.match(/[a-zA-Z0-9]+$/) || textBeforeCursor.match(/[.]$/);

            if (!match) {
                vscode.window.showInformationMessage('No English text selected or found before cursor');
                return;
            }

            word = match[0];
            const wordStart = position.character - word.length;
            wordRange = new vscode.Range(
                position.line, wordStart,
                position.line, position.character
            );
        }

        // Allow punctuation or English/Banglish text
        if (!/[a-zA-Z]/.test(word) && !PUNCTUATION_MAP[word]) {
            vscode.window.showInformationMessage('Selected text does not contain English characters');
            return;
        }

        await showSuggestions(editor, word, wordRange);
    });
    context.subscriptions.push(convertCommand);

    // Type interception for auto-convert on space (only when auto mode is ON)
    let typeDisposable = vscode.commands.registerCommand('type', async (args) => {
        // Pass through if auto mode is OFF
        if (!autoMode) {
            await vscode.commands.executeCommand('default:type', args);
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            await vscode.commands.executeCommand('default:type', args);
            return;
        }

        const char = args.text;

        // Auto-convert dot to dari immediately
        if (char === '.') {
            await vscode.commands.executeCommand('default:type', { text: '।' });
            return;
        }

        // On space/enter, auto-convert word with Google API (better accuracy)
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

                // Use Google API for better accuracy
                const suggestions = await getGoogleSuggestions(word);
                if (suggestions && suggestions.length > 0) {
                    await editor.edit(editBuilder => {
                        editBuilder.replace(wordRange, suggestions[0]);
                    });
                } else {
                    // Fallback to offline only if Google fails
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
    if (autoMode) {
        statusBarItem.text = '$(globe) বাংলা AUTO';
        statusBarItem.tooltip = 'Bangla Auto-correct ON - Space to convert. Click to switch to Manual.';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '$(globe) বাংলা';
        statusBarItem.tooltip = 'Bangla Input - Use Option+G to convert. Click to enable Auto-correct.';
        statusBarItem.backgroundColor = undefined;
    }
}

function deactivate() {
    if (statusBarItem) statusBarItem.dispose();
}

module.exports = { activate, deactivate };
