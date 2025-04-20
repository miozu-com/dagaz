// clean.js - save as clean.mjs to run as ES module
import fs from 'fs';
import path from 'path';

function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !fullPath.includes('node_modules')) {
      // Recursively search directories
      results = results.concat(findFiles(fullPath, extensions));
    } else {
      // Check file extension
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });

  return results;
}

// Find all .svelte and .css files
const files = findFiles('./src', ['.svelte', '.css']);
let count = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Replace relative imports with aliased imports using a pattern that matches various relative depths
    const updated = content.replace(
      /@import\s+['"](\.\.\/)+(.*?)theme\.css['"]/g,
      "@import '$theme/theme.css'"
    );

    if (content !== updated) {
      fs.writeFileSync(file, updated);
      console.log(`Updated: ${file}`);
      count++;
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});

console.log(`Done! Updated ${count} files.`);
