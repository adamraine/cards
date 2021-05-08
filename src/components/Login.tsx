import * as React from 'react';
import {firebase, auth} from '../firebase';

export function SignIn():JSX.Element {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export function SignOut():JSX.Element|null {
  return auth.currentUser && (
    <>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <span>{auth.currentUser.displayName}</span>
      <span>({auth.currentUser.email})</span>
    </>
  );
}