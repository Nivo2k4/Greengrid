const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files
function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Remove version numbers from imports
  const versionPattern = /@\d+\.\d+\.\d+/g;
  if (versionPattern.test(content)) {
    content = content.replace(versionPattern, '');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = findTsxFiles(srcDir);

console.log(`Found ${files.length} TypeScript files`);

files.forEach(fixImports);

console.log('Import fixing complete!');
