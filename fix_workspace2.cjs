const fs = require('fs');

let workspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');

workspace = workspace.replace(
  "const activeTask = project.tasks.find(t => t.id === activeTaskId) || project.tasks[0]",
  "const tasks = project.tasks || [];\n  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0]"
);

workspace = workspace.replace(
  "const progressPercent = project.tasks.length === 0 ? 0 : \n    Math.round((completedTasks.length / project.tasks.length) * 100)",
  "const progressPercent = tasks.length === 0 ? 0 : \n    Math.round((completedTasks.length / tasks.length) * 100)"
);

workspace = workspace.replace(
  "const currentMilestoneIndex = project.tasks.findIndex(t => !completedTasks.includes(t.id))\n  const currentMilestone = currentMilestoneIndex >= 0 ? project.tasks[currentMilestoneIndex].title : \"Complete\"",
  "const currentMilestoneIndex = tasks.findIndex(t => !completedTasks.includes(t.id))\n  const currentMilestone = currentMilestoneIndex >= 0 ? tasks[currentMilestoneIndex].title : \"Complete\""
);

workspace = workspace.replace(
  "{activeTab === \"task\" && (",
  "{activeTab === \"task\" && activeTask && ("
);

workspace = workspace.replace(
  "const currentIndex = project.tasks.findIndex(t => t.id === activeTask.id)",
  "const currentIndex = tasks.findIndex(t => t.id === activeTask.id)"
);

workspace = workspace.replace(
  "if (currentIndex < project.tasks.length - 1) {",
  "if (currentIndex < tasks.length - 1) {"
);

workspace = workspace.replace(
  "setActiveTaskId(project.tasks[currentIndex + 1].id)",
  "setActiveTaskId(tasks[currentIndex + 1].id)"
);

fs.writeFileSync('src/pages/Workspace.tsx', workspace);

