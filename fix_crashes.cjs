const fs = require('fs');

let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(
  "progress: project ? Math.round((completedTasks.length / project.tasks.length) * 100) : 0,",
  "progress: project ? Math.round((completedTasks.length / (project.tasks?.length || project.taskCount || 1)) * 100) : 0,"
);
dashboard = dashboard.replace(
  "{proj.completedTasks.length} / {proj.tasks.length} Tasks",
  "{proj.completedTasks.length} / {proj.tasks?.length || proj.taskCount || 0} Tasks"
);
fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);

let projectDetails = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf8');
projectDetails = projectDetails.replace(/\{project\.tags\.map/g, "{project.tags?.map");
projectDetails = projectDetails.replace(/\{project\.skills\.map/g, "{project.skills?.map");
projectDetails = projectDetails.replace(/\{project\.tasks\.map/g, "{project.tasks?.map");
fs.writeFileSync('src/pages/ProjectDetails.tsx', projectDetails);

let explore = fs.readFileSync('src/pages/Explore.tsx', 'utf8');
explore = explore.replace(/\{proj\.tags\.map/g, "{proj.tags?.map");
fs.writeFileSync('src/pages/Explore.tsx', explore);

let workspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');
workspace = workspace.replace(/\{project\.tasks\.map/g, "{project.tasks?.map");
fs.writeFileSync('src/pages/Workspace.tsx', workspace);

