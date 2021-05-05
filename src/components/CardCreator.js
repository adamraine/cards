import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import {useState} from 'react';

export function CardCreator() {
  const db = firebase.firestore();
  const cards = db.collection('cards');
  const storage = firebase.storage().ref();

  const auth = firebase.auth();
  const [textValue, setTextValue] = useState('');
  const [imageValue, setImageValue] = useState(/** @type {File|null} */ (null));

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const createCard = async e => {
    e.preventDefault();
    if (!imageValue) {
      alert('Please specify an image value.');
      return;
    }
    const {uid} = auth.currentUser;
    const doc = cards.doc();
    await storage.child(`images/${uid}/${doc.id}`).put(imageValue);
    await doc.set({
      text: textValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });
    setTextValue('');
    setImageValue(null);
    document.getElementById('card-image-input').value = null;
  }
  
  return (
    <div className="CardCreator">
      <form onSubmit={createCard}>
        <input value={textValue} onChange={e => setTextValue(e.target.value)}></input>
        <label htmlFor="card-image-input">Image file</label>
        <input id="card-image-input" accept="image/*" type="file" onChange={e => setImageValue(e.target.files[0])}></input>
        <button type="submit">Create card</button>
      </form>
    </div>
  )
}
