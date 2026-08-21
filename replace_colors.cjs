const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replacement] of replacements) {
    content = content.split(search).join(replacement);
  }
  fs.writeFileSync(filePath, content);
};

const replacements = [
  ['bg-red-600 hover:bg-red-500 text-white', 'bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold'],
  ['bg-red-600 text-white', 'bg-[#FFB800] text-stone-950 font-bold'],
  ['text-red-500', 'text-[#FFB800]'],
  ['text-red-600', 'text-[#FFB800]'],
  ['bg-red-500', 'bg-[#FFB800]'],
  ['border-red-500', 'border-[#FFB800]'],
  ['text-yellow-400', 'text-[#FFB800]'],
  ['from-yellow-400', 'from-[#FFB800]'],
  ['to-red-500', 'to-[#e5a600]'],
  ['hover:text-red-500', 'hover:text-[#FFB800]'],
  ['selection:bg-red-600', 'selection:bg-[#FFB800]'],
  ['ring-red-500', 'ring-[#FFB800]']
];

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));
files.push('src/App.tsx');

files.forEach(f => replaceInFile(f, replacements));
