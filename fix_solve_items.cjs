const fs = require('fs');
let code = fs.readFileSync('src/components/SolveWithAI.tsx', 'utf8');

code = code.replace(/      {/* Header section */}\n      <div className=\{`flex items-center justify-between border-b \${theme.borderCard} pb-4`\}>/, '      {/* Header section */}\n      <motion.div variants={itemVariants} className={`flex items-center justify-between border-b ${theme.borderCard} pb-4`}>');

code = code.replace(/        <\/div>\n      <\/div>\n\n      {/* Main Input Area */}\n      <div className="space-y-4">/, '        </div>\n      </motion.div>\n\n      {/* Main Input Area */}\n      <motion.div variants={itemVariants} className="space-y-4">');

code = code.replace(/        <\/div>\n      <\/div>\n\n      {/* Controls & Submit Area */}\n      <div className="flex flex-col sm:flex-row gap-3 pt-2">/, '        </div>\n      </motion.div>\n\n      {/* Controls & Submit Area */}\n      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">');

code = code.replace(/        <\/button>\n      <\/div>\n\n      {/* Error State */}/, '        </button>\n      </motion.div>\n\n      {/* Error State */}');

fs.writeFileSync('src/components/SolveWithAI.tsx', code, 'utf8');
