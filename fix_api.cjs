const fs = require('fs');

const newApiTs = `
import { auth } from './firebase';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = null;
  const isDemo = localStorage.getItem('demoMode') === 'true';
  if (isDemo) {
    token = 'DEMO_TOKEN';
  } else if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
`;

fs.writeFileSync('src/lib/api.ts', newApiTs);
