const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
code = code.replace(/      \)}\n    <\/div>\n  \);\n}/, '      )}\n    </motion.div>\n  );\n}');
fs.writeFileSync('src/components/AdminPanel.tsx', code, 'utf8');
