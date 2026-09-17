const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function test() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "test2@example.com", "password123");
    console.log("Success:", userCredential.user.uid);
  } catch (error) {
    console.error("Firebase Error:", error.code, error.message);
  }
}
test();
