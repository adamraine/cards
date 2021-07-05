import {auth, db, firebase} from '../firebase';
import React from 'react';
import styles from './Login.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';

export const Login:React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const users = db.collection('users');

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const {user} = await auth.signInWithPopup(provider);
    if (!user) return;

    const doc = users.doc(user.uid);
    if (await doc.get().then(d => d.exists)) return;
    await doc.set({
      name: user.displayName,
      picture: user.photoURL,
    });
  }

  return <div className={styles.Login}>
    {loading ? undefined :
      user ?
        <>
          <span>{user.displayName}</span>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </> :
        <>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    }
  </div>;
};