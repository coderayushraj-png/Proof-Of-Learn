const fs = require('fs');

let content = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf8');
if (!content.includes("import { fetchWithAuth }")) {
    content = content.replace(
        "import { useParams, Link, useNavigate } from \"react-router-dom\"",
        "import { useParams, Link, useNavigate } from \"react-router-dom\"\nimport { fetchWithAuth } from \"../lib/api\";"
    );
}

content = content.replace(
    /const res = await fetch\(`\/api\/projects\/\$\{id\}`\);\s*if \(!res\.ok\) \{[\s\S]*?\}\s*const data = await res\.json\(\);/m,
    "const data = await fetchWithAuth(`/api/projects/${id}`);"
);

fs.writeFileSync('src/pages/ProjectDetails.tsx', content);

let contentWorkspace = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');
if (!contentWorkspace.includes("import { fetchWithAuth }")) {
    contentWorkspace = contentWorkspace.replace(
        "import { useParams, Link } from \"react-router-dom\"",
        "import { useParams, Link } from \"react-router-dom\"\nimport { fetchWithAuth } from \"../lib/api\";"
    );
}

contentWorkspace = contentWorkspace.replace(
    /fetch\(`\/api\/projects\/\$\{projectId\}`\)\s*\.then\(res => res\.json\(\)\)/g,
    "fetchWithAuth(`/api/projects/${projectId}`)"
);

fs.writeFileSync('src/pages/Workspace.tsx', contentWorkspace);
