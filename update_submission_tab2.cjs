const fs = require('fs');
let content = fs.readFileSync('src/pages/workspace/SubmissionTab.tsx', 'utf8');

const targetStr = `<span className="text-muted-foreground">Tests</span>
                <p className="font-medium">{latestRun?.passedCount || project.tests?.length} / {project.tests?.length} passed</p>`;
const replacement = `<span className="text-muted-foreground">Tests</span>
                <p className="font-medium">{hasTests ? \`\${latestRun?.passedCount} / \${project.tests?.length} passed\` : "N/A"}</p>`;

content = content.replace(targetStr, replacement);

fs.writeFileSync('src/pages/workspace/SubmissionTab.tsx', content);
