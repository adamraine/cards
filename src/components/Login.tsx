import * as React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export function SignIn() {
  const auth = firebase.auth();
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export function SignOut() {
  const auth = firebase.auth();
  return auth.currentUser && (
    <>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <span>{auth.currentUser.displayName}</span>
      <span>({auth.currentUser.email})</span>
    </>
  );
}