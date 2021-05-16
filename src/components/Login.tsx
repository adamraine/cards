import './Login.scss';
import * as React from 'react';
import {firebase, auth, db} from '../firebase';

export function SignIn():JSX.Element {
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
    <div className="SignIn">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export function SignOut():JSX.Element|null {
  return auth.currentUser && (
    <div className="SignOut">
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <span>{auth.currentUser.displayName}</span>
      <span>({auth.currentUser.email})</span>
    </div>
  );
}