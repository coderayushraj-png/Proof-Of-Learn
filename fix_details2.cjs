const fs = require('fs');

let content = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf8');
content = content.replace(
    "const res = await fetch(`/api/projects/${id}`);\n        if (!res.ok) throw new Error('Project not found');\n        const data = await res.json();",
    "const data = await fetchWithAuth(`/api/projects/${id}`);"
);
fs.writeFileSync('src/pages/ProjectDetails.tsx', content);

let contentWorkspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');
contentWorkspace = contentWorkspace.replace(
    "fetch(`/api/projects/${projectId}`)\n      .then(res => {\n        if (!res.ok) throw new Error('Project not found');\n        return res.json();\n      })",
    "fetchWithAuth(`/api/projects/${projectId}`)"
);
fs.writeFileSync('src/pages/Workspace.tsx', contentWorkspace);
