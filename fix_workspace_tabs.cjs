const fs = require('fs');

function replaceAll(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    for (const [find, replace] of replacements) {
        content = content.split(find).join(replace);
    }
    fs.writeFileSync(file, content);
}

replaceAll('src/pages/workspace/OverviewTab.tsx', [
    ['{project.tags.map(', '{project.tags?.map('],
    ['{project.tasks.map(', '{project.tasks?.map(']
]);

replaceAll('src/pages/workspace/TaskTab.tsx', [
    ['task.criteria.map(', '(task.criteria || []).map('],
    ['{task.requirements.map(', '{(task.requirements || []).map('],
    ['{task.criteria.map(', '{(task.criteria || []).map('],
    ['{task.concepts.map(', '{(task.concepts || []).map('],
    ['task.hints.slice(', '(task.hints || []).slice(']
]);

replaceAll('src/pages/workspace/TestsTab.tsx', [
    ['projectTests.map(', '(projectTests || []).map('],
    ['testHistory.slice(', '(testHistory || []).slice(']
]);

replaceAll('src/pages/workspace/SubmissionTab.tsx', [
    ['{project.tags.map(', '{project.tags?.map(']
]);

replaceAll('src/pages/Landing.tsx', [
    ['proj.tags.map(', '(proj.tags || []).map(']
]);

replaceAll('src/pages/Dashboard.tsx', [
    ['userState.startedProjects.map(', '(userState.startedProjects || []).map('],
    ['userState.completedProjects.map(', '(userState.completedProjects || []).map('],
    ['proj.submission.technologies.map(', '(proj.submission?.technologies || []).map('],
    ['allProjects.filter(', '(allProjects || []).filter('],
    ['!userState.startedProjects.includes(', '!(userState.startedProjects || []).includes(']
]);
