const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPortal.tsx', 'utf8');

// Fix 1: Tab Banner Section close
code = code.replace(/            <\/button>\n        \)}\n      <\/div>/, '            </button>\n        )}\n      </motion.div>');

// Fix 2: left side col-span-4 close
code = code.replace(/          <\/div>\n        <\/div>\n\n        {\/\* Right Side: Active Video player and comments panel \*\//, '          </div>\n        </motion.div>\n\n        {/* Right Side: Active Video player and comments panel */');

fs.writeFileSync('src/components/VideoPortal.tsx', code, 'utf8');
