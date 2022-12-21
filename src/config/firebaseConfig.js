import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendPasswordResetEmail,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {getFirestore,} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_SloIsra4v8TKFW-VCGBpthntRo6UHC0",
    authDomain: "base-management-a75c5.firebaseapp.com",
    projectId: "base-management-a75c5",
    storageBucket: "base-management-a75c5.appspot.com",
    messagingSenderId: "304382252775",
    appId: "1:304382252775:web:bdf71053e524ae70aff442"
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        alert(JSON.stringify(user, null, 2));
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

const signInAsAnonymous = () => {
    signInAnonymously(auth)
        .then(() => {
            // Signed in..
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`${errorCode} ${errorMessage}`)
        });
}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, user => {
    console.log({auth, user})
});
const db = getFirestore(app);
export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    signInAsAnonymous
}