import './App.css';
import {SignIn, SignOut} from './Login';
import {Deck} from './Deck';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import React from 'react';


firebase.initializeApp({
  apiKey: "AIzaSyCZHOpVSdID1r-SQeTikbcRvLaX_TuF_UA",
  authDomain: "cards-38a9a.firebaseapp.com",
  databaseURL: "https://cards-38a9a-default-rtdb.firebaseio.com",
  projectId: "cards-38a9a",
  storageBucket: "cards-38a9a.appspot.com",
  messagingSenderId: "372132751681",
  appId: "1:372132751681:web:5890d7c6a8ec0ef01a19c0",
  measurementId: "G-EY0Y01QT1J"
})

const auth = firebase.auth();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        {user ? <SignOut/> : <SignIn/>}
      </header>
      <main>
        {user && <Deck/>}
      </main>
    </div>
  );
}

export default App;
