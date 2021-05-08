import * as React from 'react';
import {Card} from './Card';
import {auth, db} from '../firebase';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export function Deck():JSX.Element {
  const cards = db.collection('cards');
  if (!auth.currentUser) throw new Error('User must be logged in.');
  const query = cards.where('uid', '==', auth.currentUser.uid).orderBy('createdAt').limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});

  return (
    <div className="Deck">
      <>
        {userCards && userCards.filter(card => card.uid).map(card => <Card key={card.id} data={card}/>)}
      </>
    </div>
  );
}
