import fs from 'fs';
const file = fs.readFileSync('server.ts', 'utf8');
const newFile = file.replace(/gemini-1\.5-flash/g, 'gemini-2.5-flash-lite');
fs.writeFileSync('server.ts', newFile);
console.log('Replaced successfully');
