const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'start',
  'server',
  'metro',
  'externals.js'
);

if (!fs.existsSync(filePath)) {
  process.exit(0);
}

const current = fs.readFileSync(filePath, 'utf8');

if (current.includes('const rawNodeStdlibModules = [')) {
  process.exit(0);
}

const start = current.indexOf('const NODE_STDLIB_MODULES = [');
const end = current.indexOf('].sort();', start);

if (start === -1 || end === -1) {
  console.warn('[postinstall] Expo externals patch skipped: target block not found.');
  process.exit(0);
}

const replacement = `const rawNodeStdlibModules = [
    "fs/promises",
    ...(_module.builtinModules || // @ts-expect-error
    (process.binding ? Object.keys(process.binding("natives")) : []) || []).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![
            "sys"
        ].includes(x)
    ), 
];
const NODE_STDLIB_MODULES = Array.from(new Set(rawNodeStdlibModules.map((x)=>x.replace(/^node:/, "")))).sort();`;

const patched = `${current.slice(0, start)}${replacement}${current.slice(end + '].sort();'.length)}`;

fs.writeFileSync(filePath, patched);
console.log('[postinstall] Patched Expo Metro node externals for Windows Node 24 compatibility.');
