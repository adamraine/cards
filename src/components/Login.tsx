import * as React from 'react';
import {auth, db, firebase} from '../firebase';
import styles from './Login.module.scss';

export const SignIn:React.FunctionComponent = () => {
  const users = db.collection('users');
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const {user} = await auth.signInWithPopup(provider);
    if (!user) return;

    const doc = users.doc(user.uid);
    if (await doc.get().then(d => d.exists)) return;
    await doc.set({
      name: user.displayName,
      picture: user.photoURL,
    });
  };
  return (
    <div className={styles.Login}>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export const SignOut:React.FunctionComponent = () => {
  return auth.currentUser && (
    <div className={styles.Logout}>
      <span>{auth.currentUser.displayName}</span>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};