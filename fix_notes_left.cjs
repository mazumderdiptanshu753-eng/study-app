const fs = require('fs');
let code = fs.readFileSync('src/components/NotesManager.tsx', 'utf8');
code = code.replace(/          <\/motion\.div>\n        <\/div>\n      <\/div>/, '          </motion.div>\n        </div>\n      </motion.div>');
fs.writeFileSync('src/components/NotesManager.tsx', code, 'utf8');
