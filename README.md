# Bangla Input - বাংলা ইনপুট

Fast, accurate Banglish to Bengali transliteration for VS Code with Google API suggestions.

![Demo](https://img.shields.io/badge/language-Bengali-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![VS Code](https://img.shields.io/badge/VS%20Code-1.74+-purple)

## Features

✅ **Google API Suggestions** - Accurate transliteration like Chrome extension  
✅ **5 Suggestions Popup** - Pick the right word from multiple options  
✅ **Auto-Convert on Space** - Type naturally, converts automatically  
✅ **Offline Fallback** - Works without internet using local dictionary  
✅ **200+ Word Dictionary** - Common Bengali words for quick conversion  

## Installation

### From VSIX (Recommended)
1. Download the latest `.vsix` file from [Releases](../../releases)
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Type "Install from VSIX" and select the downloaded file

### From Source
```bash
git clone https://github.com/YOUR_USERNAME/bangla-input-vscode.git
cd bangla-input-vscode
npm install
npm run package
code --install-extension bangla-input-*.vsix
```

## Usage

### Keyboard Shortcuts

| Shortcut | Mac | Action |
|----------|-----|--------|
| Toggle ON/OFF | `⌥G` (Option+G) | Enable/disable Bangla input |
| Show Suggestions | `⌘G` (Cmd+G) | Show 5 transliteration options |

### How to Use

1. **Enable**: Press `Option+G` → Status bar shows "বাংলা ON"
2. **Type**: Write in Banglish (e.g., `ami bangla likhchi`)
3. **Convert**: Press `Space` to auto-convert, or `Cmd+G` for suggestions

### Examples

| You type | You get |
|----------|---------|
| ami | আমি |
| tumi | তুমি |
| bangla | বাংলা |
| kemon acho | কেমন আছো |
| dhonnobad | ধন্যবাদ |
| joigo | যৌগ (via Google API) |

## How It Works

1. **Google API First** - Fetches accurate suggestions from Google Input Tools
2. **Offline Fallback** - Uses local phonetic rules if API fails
3. **Smart Dictionary** - 200+ common words for instant conversion

## Phonetic Rules

Based on Avro Keyboard patterns:

| English | Bengali |
|---------|---------|
| kh | খ |
| gh | ঘ |
| ch | ছ |
| jh | ঝ |
| th | থ |
| dh | ধ |
| ph | ফ |
| bh | ভ |
| sh | শ |
| ng | ং |

## Requirements

- VS Code 1.74 or higher
- Internet connection (for Google API suggestions)

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

If you find any words that don't transliterate correctly, please [open an issue](../../issues) with:
- The word you typed
- What you expected
- What you got

---

**Made with ❤️ for Bengali speakers**
