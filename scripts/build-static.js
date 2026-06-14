const fs = require('fs');
const path = require('path');

// Resolve EJS module. Since ejs is a dependency in /functions, we try to require it from functions/node_modules/ejs if not in root.
let ejs;
try {
  ejs = require('ejs');
} catch (e) {
  try {
    const ejsPath = path.join(__dirname, '../functions/node_modules/ejs');
    ejs = require(ejsPath);
  } catch (err) {
    console.error('Error: EJS module not found. Please run "npm install" in functions directory first.');
    process.exit(1);
  }
}

const templatePath = path.join(__dirname, '../functions/views/index.ejs');
const outputPath = path.join(__dirname, '../public/index.html');

console.log('Compiling template:', templatePath);

ejs.renderFile(templatePath, { title: 'Home' }, (err, str) => {
  if (err) {
    console.error('Error rendering EJS template:', err);
    process.exit(1);
  }
  
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, str, 'utf8');
  console.log('Successfully compiled static HTML to:', outputPath);
});
