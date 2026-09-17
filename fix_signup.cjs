const fs = require('fs');
let content = fs.readFileSync('src/pages/SignUp.tsx', 'utf8');

const regex = /catch \(err: any\) \{[\s\S]*?\} finally \{/m;
const replacement = `catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email is already in use.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password sign-in is not enabled in Firebase. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else if (err.code === 'auth/invalid-api-key') {
        setError("Firebase configuration is invalid or missing.");
      } else {
        setError("Failed to create account. Try again.");
        console.error(err);
      }
    } finally {`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/SignUp.tsx', content);

let contentLogin = fs.readFileSync('src/pages/Login.tsx', 'utf8');
const regexLogin = /catch \(err: any\) \{[\s\S]*?\} finally \{/m;
const replacementLogin = `catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password sign-in is not enabled in Firebase. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        setError("Failed to sign in. Try again.");
        console.error(err);
      }
    } finally {`;

contentLogin = contentLogin.replace(regexLogin, replacementLogin);
fs.writeFileSync('src/pages/Login.tsx', contentLogin);
