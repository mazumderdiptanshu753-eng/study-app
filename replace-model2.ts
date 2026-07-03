import fs from 'fs';
const file = fs.readFileSync('server.ts', 'utf8');
const newFile = file.replace(/gemini-2\.5-flash-lite/g, 'gemini-flash-latest');
fs.writeFileSync('server.ts', newFile);
console.log('Replaced successfully');
