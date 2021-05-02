import {Card} from './Card';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useState} from 'react';

export function Deck() {
  const db = firebase.firestore();
  const cards = db.collection('cards');
  const auth = firebase.auth();
  const query = cards.where('uid', '==', auth.currentUser.uid).orderBy('createdAt').limit(25);
  const [userCards] = useCollectionData(query, {idField: 'id'});
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
    <div className="Deck">
      {userCards && userCards.map(card => <Card key={card.id} data={card}/>)}
      <form onSubmit={createCard}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)}></input>
        <button type="submit">Create card</button>
      </form>
    </div>
  )
}
