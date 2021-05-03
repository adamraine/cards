import {Card} from './Card';
import {CardCreator} from './CardCreator';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {useCollectionData} from 'react-firebase-hooks/firestore';

export function Deck() {
  const db = firebase.firestore();
  const cards = db.collection('cards');
  const auth = firebase.auth();
  const query = cards.where('uid', '==', auth.currentUser.uid).orderBy('createdAt').limit(25);
  const [userCards] = useCollectionData(query, {idField: 'id'});

  return (
    <div className="Deck">
      {userCards && userCards.map(card => <Card key={card.id} data={card}/>)}
      <CardCreator/>
    </div>
  )
}
