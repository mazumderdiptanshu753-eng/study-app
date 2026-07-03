const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('html, body {', 'html, body {\n    height: 100%;\n    width: 100%;\n    overflow-x: hidden;');
css = css.replace('#root {', '#root {\n    height: 100%;\n    width: 100%;');
fs.writeFileSync('src/index.css', css, 'utf8');
