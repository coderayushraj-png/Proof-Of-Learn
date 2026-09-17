const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\";\n", "");

content = content.replace("const project = allProjects.find(p => p.id === projectId);\n      \n      let newCompletedProjects", "let newCompletedProjects");

content = content.replace("const project = allProjects.find(p => p.id === projectId);\n      let newCompletedProjects", "let newCompletedProjects");

content = content.replace("notify(\"Project Verified!\", `You successfully completed and verified ${project?.title}.`, \"success\");", "notify(\"Project Verified!\", `You successfully completed and verified the project.`, \"success\");");

fs.writeFileSync('src/context/AppContext.tsx', content);
