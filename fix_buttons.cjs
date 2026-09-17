const fs = require('fs');

let content = fs.readFileSync('src/pages/SignUp.tsx', 'utf8');
content = content.replace(
  "const { signUpWithEmail, signInWithGoogle } = useAuth();",
  "const { signUpWithEmail, signInWithGoogle, signInAsDemo } = useAuth();"
);

let demoBtn = `
        <Button type="button" variant="outline" className="w-full mt-3" onClick={async () => {
          await signInAsDemo();
          navigate('/dashboard');
        }}>
          Bypass Authentication (Demo Mode)
        </Button>
`;

content = content.replace(
  /<\/Button>\s*<div className="mt-6 text-center text-sm">/,
  `</Button>${demoBtn}\n        <div className="mt-6 text-center text-sm">`
);

fs.writeFileSync('src/pages/SignUp.tsx', content);

let contentLogin = fs.readFileSync('src/pages/Login.tsx', 'utf8');
contentLogin = contentLogin.replace(
  "const { signInWithEmail, signInWithGoogle } = useAuth();",
  "const { signInWithEmail, signInWithGoogle, signInAsDemo } = useAuth();"
);

contentLogin = contentLogin.replace(
  /<\/Button>\s*<div className="mt-6 text-center text-sm">/,
  `</Button>${demoBtn}\n        <div className="mt-6 text-center text-sm">`
);

fs.writeFileSync('src/pages/Login.tsx', contentLogin);
