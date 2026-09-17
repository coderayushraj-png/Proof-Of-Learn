const fs = require('fs');

let portfolio = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');
portfolio = portfolio.replace(/\{completedProjects\.map/g, "{(completedProjects || []).map");
portfolio = portfolio.replace(/\{\(proj\.submission\?\.technologies \|\| proj\.tags \|\| \[\]\)\.map/g, "{(proj.submission?.technologies || proj.tags || []).map");
fs.writeFileSync('src/pages/Portfolio.tsx', portfolio);

let skills = fs.readFileSync('src/pages/Skills.tsx', 'utf8');
skills = skills.replace(/\{skillsList\.map/g, "{(skillsList || []).map");
fs.writeFileSync('src/pages/Skills.tsx', skills);

