const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPortal.tsx', 'utf8');
code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/, '</motion.div>\n      </motion.div>\n    </motion.div>\n  );\n}');
fs.writeFileSync('src/components/VideoPortal.tsx', code, 'utf8');
