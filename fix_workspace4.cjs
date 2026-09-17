const fs = require('fs');
let workspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');

workspace = workspace.replace(
  "badge={`${completedTasks.length} / ${project.tasks.length}`}",
  "badge={`${completedTasks.length} / ${tasks.length}`}"
);

workspace = workspace.replace(
  "badge={completedTasks.length === project.tasks.length ? \"All passing\" : \"Pending\"}",
  "badge={completedTasks.length === tasks.length ? \"All passing\" : \"Pending\"}"
);

workspace = workspace.replace(
  "badge={completedTasks.length === project.tasks.length ? \"Ready\" : \"Locked\"}",
  "badge={completedTasks.length === tasks.length ? \"Ready\" : \"Locked\"}"
);

workspace = workspace.replace(
  "disabled={completedTasks.length !== project.tasks.length && activeTab !== \"submission\"}",
  "disabled={completedTasks.length !== tasks.length && activeTab !== \"submission\"}"
);

workspace = workspace.replace(
  "{project.tasks?.map((task, index) => {",
  "{tasks.map((task, index) => {"
);

workspace = workspace.replace(
  "completedTasks.includes(project.tasks[index - 1].id)",
  "completedTasks.includes(tasks[index - 1].id)"
);

fs.writeFileSync('src/pages/Workspace.tsx', workspace);
