# Asma Ul Husna Memorizer

A Chrome extension for learning, listening to, revising, and memorizing the 99 Names of Allah with Arabic names, Bangla meanings, transliteration, audio pronunciation, and locally saved progress.

## Purpose

This extension helps users build a consistent memorization habit for Asma Ul Husna. It presents the names sequentially from 1 to 99, remembers the user's progress in browser local storage, and provides a revision mode for names already memorized.

## Features

- Sequential learning flow from name 1 to name 99
- Arabic name, transliteration, and Bangla meaning
- Audio pronunciation for each name
- `Remembered` action to save memorization progress
- `Revise` mode for previously memorized names
- Progress counter and visual progress bar
- Local-only progress storage using browser `localStorage`
- No special Chrome permissions required
- Offline-friendly local JSON and audio assets

## Project Structure

```text
.
|-- manifest.json
|-- home.html
|-- style.css
|-- script.js
|-- db/
|   `-- data.json
`-- assets/
    |-- audio/
    |   `-- *.mp3
    `-- images/
        |-- background.png
        |-- logo.png
        |-- logo-16.png
        |-- logo-32.png
        |-- logo-48.png
        `-- volume.png
```

## Installation for Development

1. Clone the repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the project folder.
6. Click the extension icon to open the popup.

## Publishing Package

To prepare the extension for Chrome Web Store upload:

1. Make sure all files are saved.
2. Load the extension unpacked and test Learn, Revise, Remembered, and Listen.
3. Zip the project contents, not the parent folder.
4. Upload the zip file in the Chrome Web Store Developer Dashboard.

## Privacy

This extension does not request any special Chrome permissions. Memorization progress is stored locally in the browser with `localStorage`. No user data is sent to an external server.

If the user clears browser or extension storage, memorization progress will reset.

## Tech Stack

- Chrome Extension Manifest V3
- HTML
- CSS
- Vanilla JavaScript
- Local JSON data
- Local MP3 audio assets

## Single Purpose

This extension helps users learn, listen to, revise, and memorize the 99 Names of Allah with Bangla meanings and locally saved progress.

## License

Add a license before publishing publicly on GitHub if you want others to know how they may use, copy, or modify this project.
