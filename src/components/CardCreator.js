import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {useState} from 'react';

export function CardCreator() {
  const db = firebase.firestore();
  const cards = db.collection('cards');
  const auth = firebase.auth();
  const [formValue, setFormValue] = useState('');

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const createCard = async e => {
    e.preventDefault();
    const {uid} = auth.currentUser;
    await cards.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });
    setFormValue('');
  }

  return (
    <div className="CardCreator">
      <form onSubmit={createCard}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)}></input>
        <button type="submit">Create card</button>
      </form>
    </div>
  )
}
