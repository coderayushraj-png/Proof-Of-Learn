const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const imports = `import { fetchWithAuth } from '../lib/api';
import { useAuth } from './AuthContext';`;

content = content.replace(`import { allProjects } from "../data/projects";`, `import { allProjects } from "../data/projects";\n${imports}`);

// Remove useLocalStorage and replace with useState + useEffect
content = content.replace(`const [userState, setUserState] = useLocalStorage<UserState>("pol-user-state", defaultState);`, 
`const [userState, setUserState] = React.useState<UserState>(defaultState);
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      fetchWithAuth('/api/me/sync').then(data => {
        if (data) {
          setUserState(prev => ({
            ...prev,
            ...data
          }));
        }
      }).catch(console.error);
    } else {
      setUserState(defaultState);
    }
  }, [user]);`);

// Update startProject
content = content.replace(`const startProject = (projectId: string) => {`, `const startProject = async (projectId: string) => {
    if (user) {
      try {
        await fetchWithAuth(\`/api/me/projects/\${projectId}/start\`, { method: 'POST' });
      } catch (e) {
        console.error(e);
      }
    }`);

// Update completeTask
content = content.replace(`const completeTask = (projectId: string, taskId: string) => {`, `const completeTask = async (projectId: string, taskId: string) => {
    if (user) {
      try {
        await fetchWithAuth(\`/api/me/tasks/\${taskId}/complete\`, { method: 'POST' });
      } catch (e) {
        console.error(e);
      }
    }`);

// Update recordTestRun
content = content.replace(`const recordTestRun = (projectId: string, testRun: any) => {`, `const recordTestRun = async (projectId: string, testRun: any) => {
    if (user) {
      try {
        await fetchWithAuth(\`/api/me/projects/\${projectId}/tests\`, {
          method: 'POST',
          body: JSON.stringify(testRun)
        });
      } catch (e) {
        console.error(e);
      }
    }`);

// Update submitProject
content = content.replace(`const submitProject = (projectId: string, submission: any) => {`, `const submitProject = async (projectId: string, submission: any) => {
    if (user) {
      try {
        await fetchWithAuth(\`/api/me/projects/\${projectId}/submit\`, {
          method: 'POST',
          body: JSON.stringify(submission)
        });
      } catch (e) {
        console.error(e);
      }
    }`);

fs.writeFileSync('src/context/AppContext.tsx', content);
