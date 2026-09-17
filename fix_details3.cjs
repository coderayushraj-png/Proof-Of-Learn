const fs = require('fs');

let content = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf8');
content = content.replace(
    '<p className="text-muted-foreground mb-8">We couldn\'t load this project.</p>',
    '<p className="text-muted-foreground mb-8">We couldn\'t load this project.</p>\n        {error && <p className="text-red-500 mb-8">{error}</p>}'
);
fs.writeFileSync('src/pages/ProjectDetails.tsx', content);

let contentWorkspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');
contentWorkspace = contentWorkspace.replace(
    'return <div className="p-8 text-center text-muted-foreground">Project not found</div>',
    'return <div className="p-8 text-center text-red-500">Project not found: {error}</div>'
);
fs.writeFileSync('src/pages/Workspace.tsx', contentWorkspace);
