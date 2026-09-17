const fs = require('fs');
let content = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');

content = content.replace("const { projectId } = useParams()", "const { id: projectId } = useParams()");
fs.writeFileSync('src/pages/Workspace.tsx', content);

let contentApp = fs.readFileSync('src/App.tsx', 'utf8');
contentApp = contentApp.replace('path="/workspace/:id"', 'path="/workspace/:id"'); // it is already :id
fs.writeFileSync('src/App.tsx', contentApp);

