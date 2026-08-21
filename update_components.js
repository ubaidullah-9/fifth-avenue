const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'AdminDashboard.tsx' && f !== 'BrandLogo.tsx' && f !== 'Features.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import from data
  content = content.replace(/import {([^}]+)} from '\.\.\/data';/g, "import { useFirebaseData } from '../FirebaseDataContext';");

  // Inject the hook at the beginning of the component
  content = content.replace(/export default function (\w+)\(\) {/g, "export default function $1() {\n  const { menuItems, deals, businessDetails } = useFirebaseData();\n");

  // Fix up specific files if needed
  if(file === 'Menu.tsx') {
    // Menu.tsx also imports menuCategories. Since it's not dynamic, we should keep it.
    // Let's add it back if it's there
    if(content.includes('menuCategories')) {
      content = `import { menuCategories } from '../data';\n${content}`;
    }
  }

  fs.writeFileSync(filePath, content);
});
