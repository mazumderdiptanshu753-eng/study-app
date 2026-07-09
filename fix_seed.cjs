const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStrStart = '  try {\n    const count = await getAiPdfNotesCount();\n    if (count === 0) {\n      const seedData = [';
const targetStrEnd = '      console.log("AI PDF notes already exist in Database.");\n    }\n  } catch (err) {\n    console.error("Failed to seed AI PDF notes:", err);\n  }';

const startIndex = code.indexOf(targetStrStart);
const endIndex = code.indexOf(targetStrEnd) + targetStrEnd.length;

if (startIndex !== -1 && code.indexOf(targetStrEnd) !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('server.ts', code);
  console.log("Successfully removed seed logic.");
} else {
  console.log("Could not find seed logic to remove.");
}
