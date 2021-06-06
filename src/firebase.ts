import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import firebase from 'firebase/app';

firebase.initializeApp({
  apiKey: 'AIzaSyCZHOpVSdID1r-SQeTikbcRvLaX_TuF_UA',
  authDomain: 'cards-38a9a.firebaseapp.com',
  databaseURL: 'https://cards-38a9a-default-rtdb.firebaseio.com',
  projectId: 'cards-38a9a',
  storageBucket: 'cards-38a9a.appspot.com',
  messagingSenderId: '372132751681',
  appId: '1:372132751681:web:5890d7c6a8ec0ef01a19c0',
  measurementId: 'G-EY0Y01QT1J',
});

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

if (location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', 9000);
  storage.useEmulator('localhost', 9199);
}

export {firebase, auth, db, storage};
