const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'public', 'static', 'css', 'obsidian.css');
const destinationDirectory = path.join(__dirname, '..', 'static', 'css');
const destination = path.join(destinationDirectory, 'obsidian.css');

fs.mkdirSync(destinationDirectory, { recursive: true });
fs.copyFileSync(source, destination);
