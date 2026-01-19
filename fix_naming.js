const fs = require('fs');
const path = 'e:/web/honor-speed-assistant-react19/honor-speed-assistant-react19/src/mock/hero/index.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace heroType: '...' with heroTypes: ['...']
content = content.replace(/heroType: '([^']*)'/g, "heroTypes: ['$1']");

// Also fix the filter functions at the end
content = content.replace(/hero\.heroType === '([^']*)'/g, "hero.heroTypes.includes('$1')");

fs.writeFileSync(path, content);
console.log('Done');
