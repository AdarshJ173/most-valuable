const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'shop', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Find the duplicated import section.
const duplicateStart = 112; // 0-indexed, so line 113.
const duplicateEnd = 228; // 0-indexed, so line 229.

lines.splice(duplicateStart, duplicateEnd - duplicateStart);

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Fixed duplication. Total lines:', lines.length);
