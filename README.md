# Bangla Input - বাংলা ইনপুট

Fast, accurate Banglish to Bengali transliteration for VS Code with Google API suggestions.

![Demo](https://img.shields.io/badge/language-Bengali-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![VS Code](https://img.shields.io/badge/VS%20Code-1.74+-purple)

## Features

✅ **Google API Suggestions** - Accurate transliteration like Chrome extension  
✅ **5 Suggestions Popup** - Pick the right word from multiple options  
✅ **Number Key Selection** - Press 1-5 to quickly pick suggestions  
✅ **Auto-correct Mode** - Optional - converts automatically on Space  
✅ **Dari Support** - Dot (`.`) converts to Bengali dari (`।`) in auto mode  
✅ **Offline Fallback** - Works without internet using local dictionary  
✅ **600+ Word Dictionary** - Common Bengali words for instant conversion  

## Installation

### Method 1: Download VSIX (Easiest)

1. Go to [Releases](https://github.com/MuntasirMalek/bangla-input-vscode/releases)
2. Download the latest `bangla-input-x.x.x.vsix` file
3. Open VS Code
4. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
5. Type **"Install from VSIX"** and press Enter
6. Select the downloaded `.vsix` file
7. Reload VS Code when prompted

### Method 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/MuntasirMalek/bangla-input-vscode.git
cd bangla-input-vscode

# Install dependencies
npm install

# Package the extension
npm install -g @vscode/vsce
vsce package

# Install in VS Code
code --install-extension bangla-input-*.vsix
```

## Keyboard Shortcuts

| Action | Mac | Windows/Linux | Description |
|--------|-----|---------------|-------------|
| **Convert** | `Cmd+G` | `Ctrl+Shift+G` | Convert selected text or word before cursor to Bengali |
| **Toggle Auto Mode** | `Cmd+Shift+G` | `Ctrl+Alt+G` | Switch between Manual and Auto-correct mode |
| **To Select - Press** | `1` - `5` | `1` - `5` | Press number key to select suggestion from popup |

## How to Use

### Default: Manual Mode (Recommended)
The extension is **always ON** and ready to convert. Just type in Banglish and convert when needed.

1. Type in Banglish: `ami bangla likhchi`
2. Select the text (or just place cursor after a word)
3. Press `Cmd+G` → Pick from 5 Google suggestions
4. Or press `1-5` to quickly select a suggestion

### Optional: Auto-correct Mode
For automatic conversion on Space (may miss words when typing fast).

1. Press `Cmd+Shift+G` to enable → Status bar shows **"বাংলা AUTO"**
2. Type in Banglish: `ami bangla likhchi`
3. Press `Space` → automatically converts each word
4. Dot (`.`) automatically becomes dari (`।`)
5. Press `Cmd+Shift+G` again to go back to Manual mode

## Status Bar Indicator

| Status | Meaning |
|--------|---------|
| **বাংলা** | Manual mode - use Cmd+G to convert |
| **বাংলা AUTO** | Auto-correct mode - converts on Space |

## Examples

| You type | You get |
|----------|---------|
| ami | আমি |
| tumi | তুমি |
| bangla | বাংলা |
| kemon acho | কেমন আছো |
| dhonnobad | ধন্যবাদ |
| bangladeshke | বাংলাদেশকে |
| hello | হ্যালো |
| . | । (dari - in auto mode) |

## How It Works

1. **Google API First** - Fetches accurate suggestions from Google Input Tools
2. **Offline Fallback** - Uses local phonetic rules if API fails
3. **Smart Dictionary** - 600+ common words for instant conversion

## Phonetic Rules

Based on Avro Keyboard patterns:

| English | Bengali | English | Bengali |
|---------|---------|---------|---------|
| kh | খ | sh | শ |
| gh | ঘ | ng | ং |
| ch | ছ | th | থ |
| jh | ঝ | dh | ধ |
| ph | ফ | bh | ভ |

## Requirements

- VS Code 1.74 or higher
- Internet connection (for Google API suggestions, works offline with fallback)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding Words to Dictionary

Edit `transliterate.js` and add words to the `DICTIONARY` object:

```javascript
const DICTIONARY = {
  'yourword': 'আপনার_শব্দ',
  // ... more words
};
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- Google Input Tools API for transliteration
- Avro Keyboard for phonetic patterns inspiration

## Support

If you find any words that don't transliterate correctly, please [open an issue](https://github.com/MuntasirMalek/bangla-input-vscode/issues) with:
- The word you typed
- What you expected
- What you got

---

**Made with ❤️ for Bengali speakers**
