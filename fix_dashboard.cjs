const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!content.includes("import { fetchWithAuth }")) {
    content = content.replace(
        "import { useAuth } from \"../context/AuthContext\";",
        "import { useAuth } from \"../context/AuthContext\";\nimport { fetchWithAuth } from \"../lib/api\";"
    );
}

content = content.replace(
    /fetch\('\/api\/projects'\)\s*\.then\(res => res\.json\(\)\)/g,
    "fetchWithAuth('/api/projects')"
);

fs.writeFileSync('src/pages/Dashboard.tsx', content);

let contentExplore = fs.readFileSync('src/pages/Explore.tsx', 'utf8');
if (!contentExplore.includes("import { fetchWithAuth }")) {
    contentExplore = contentExplore.replace(
        "import { Link } from \"react-router-dom\"",
        "import { Link } from \"react-router-dom\"\nimport { fetchWithAuth } from \"../lib/api\";"
    );
}

contentExplore = contentExplore.replace(
    /const res = await fetch\('\/api\/projects\?' \+ queryParams\.toString\(\)\);\s*if \(!res\.ok\) throw new Error\('Failed to load projects'\);\s*const data = await res\.json\(\);/g,
    "const data = await fetchWithAuth('/api/projects?' + queryParams.toString());"
);
contentExplore = contentExplore.replace(
    /const res = await fetch\('\/api\/projects'\);\s*if \(!res\.ok\) throw new Error\('Failed to load projects'\);\s*const data = await res\.json\(\);/g,
    "const data = await fetchWithAuth('/api/projects');"
);
fs.writeFileSync('src/pages/Explore.tsx', contentExplore);

