const fs = require('fs');
const file = 'src/components/SolveWithAI.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<p className={`text-xs \${theme.textMuted} font-medium mt-1`}>{t.subtitle}<\/p>\s*<\/div>/g,
  `<p className={\`text-xs \${theme.textMuted} font-medium mt-1\`}>{t.subtitle}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className={\`p-2 rounded-full hover:bg-slate-500/10 transition-colors \${theme.textMuted}\`}
          >
            <X className="h-5 w-5" />
          </button>
        )}`
);

fs.writeFileSync(file, content);
