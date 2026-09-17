const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

content = content.replace("import { userProjects, userTasks, projects, tasks, submissions } from '../db/schema.ts';", 
"import { userProjects, userTasks, projects, tasks, submissions, testRuns, notifications } from '../db/schema.ts';");

fs.writeFileSync('src/api/me.ts', content);
