const fs = require('fs');
let code = fs.readFileSync('src/components/SolveWithAI.tsx', 'utf8');

const variantsStr = `
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={\`rounded-2xl border \${theme.borderCard} \${theme.bgCard} shadow-md p-6 space-y-6 transition-all duration-300\`}
    >
`;

code = code.replace(/  return \(\n    <div className=\{`rounded-2xl border \$\{theme.borderCard\} \$\{theme.bgCard\} shadow-md p-6 space-y-6 transition-all duration-300`\}>/, variantsStr);

fs.writeFileSync('src/components/SolveWithAI.tsx', code, 'utf8');
