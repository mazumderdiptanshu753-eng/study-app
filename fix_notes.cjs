const fs = require('fs');
let code = fs.readFileSync('src/components/NotesManager.tsx', 'utf8');
code = code.replace(/        <\/div>\n\n      {\/\* RIGHT PANEL/, '        </motion.div>\n\n      {/* RIGHT PANEL');
fs.writeFileSync('src/components/NotesManager.tsx', code, 'utf8');
