const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace .toLocaleDateString('uk-UA'...) or 'en-US'
  content = content.replace(/\.toLocaleDateString\(\s*["'](uk-UA|en-US)["']/g, '.toLocaleDateString(document.documentElement.lang === "uk" ? "uk-UA" : "en-US"');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
    changed++;
  }
});
console.log('Total files updated:', changed);
