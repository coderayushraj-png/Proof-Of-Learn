const fs = require('fs');
let content = fs.readFileSync('src/pages/workspace/SubmissionTab.tsx', 'utf8');

const targetStr = `const allTestsPassed = latestRun?.passedCount === latestRun?.totalCount && latestRun?.totalCount > 0`;
const replacement = `const hasTests = project.tests && project.tests.length > 0;
  const allTestsPassed = hasTests 
    ? (latestRun?.passedCount === latestRun?.totalCount && latestRun?.totalCount > 0)
    : true;`;

content = content.replace(targetStr, replacement);

const targetStr2 = `{allTestsPassed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={allTestsPassed ? "text-foreground" : "text-muted-foreground"}>Tests ({latestRun?.passedCount || 0}/{latestRun?.totalCount || project.tests?.length || 0})</span>`;

const replacement2 = `{allTestsPassed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={allTestsPassed ? "text-foreground" : "text-muted-foreground"}>
                {hasTests ? \`Tests (\${latestRun?.passedCount || 0}/\${latestRun?.totalCount || project.tests?.length || 0})\` : "Tests (Not required)"}
              </span>`;
              
content = content.replace(targetStr2, replacement2);

fs.writeFileSync('src/pages/workspace/SubmissionTab.tsx', content);
