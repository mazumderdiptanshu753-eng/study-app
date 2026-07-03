const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
code = code.replace(/<\/div>\s*}\)\s*}\s*<\/div>\s*\);\s*}/, '</motion.div>\n      )}\n    </motion.div>\n  );\n}');
fs.writeFileSync('src/components/AdminPanel.tsx', code, 'utf8');
