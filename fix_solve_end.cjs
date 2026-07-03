const fs = require('fs');
let code = fs.readFileSync('src/components/SolveWithAI.tsx', 'utf8');

code = code.replace(/    <\/div>\n  \);\n}/, '    </motion.div>\n  );\n}');
fs.writeFileSync('src/components/SolveWithAI.tsx', code, 'utf8');
