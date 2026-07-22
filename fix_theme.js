const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps/web/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Insert ThemeToggle import
content = content.replace("import { CtaForm } from './components/CtaForm';", "import { CtaForm } from './components/CtaForm';\nimport { ThemeToggle } from './components/ThemeToggle';");

// Insert ThemeToggle button
content = content.replace(
  '<Link \n              href="/get-started" \n              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"\n            >',
  '<ThemeToggle />\n            <Link \n              href="/get-started" \n              className="px-4 py-2.5 text-sm font-semibold text-foreground hover:text-blue-600 transition-colors"\n            >'
);

// Replace hardcoded utility classes with semantic classes
const replacements = [
  [/bg-slate-50/g, 'bg-background'],
  [/bg-white\/80/g, 'bg-background/80'],
  [/bg-white/g, 'bg-card'],
  [/text-slate-900/g, 'text-foreground'],
  [/text-slate-700/g, 'text-foreground'],
  [/text-slate-600/g, 'text-muted-foreground'],
  [/text-slate-500/g, 'text-muted-foreground'],
  [/text-slate-400/g, 'text-muted-foreground'],
  [/text-slate-300/g, 'text-muted-foreground'],
  [/border-slate-200\/80/g, 'border-border/80'],
  [/border-slate-200\/90/g, 'border-border/90'],
  [/border-slate-200\/70/g, 'border-border/70'],
  [/border-slate-200\/60/g, 'border-border/60'],
  [/border-slate-200/g, 'border-border'],
  [/border-slate-100/g, 'border-border/50'],
  [/from-slate-50/g, 'from-background'],
  [/via-white/g, 'via-card'],
  [/to-slate-50/g, 'to-background']
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

fs.writeFileSync(filePath, content);
console.log('Fixed themes in page.tsx');
