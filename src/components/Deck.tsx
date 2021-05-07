import * as React from 'react';
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
  if (!auth.currentUser) throw new Error('User must be logged in.');
  const query = cards.where('uid', '==', auth.currentUser.uid).orderBy('createdAt').limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});

  return (
    <div className="Deck">
      {userCards && userCards.filter(card => card.uid).map(card => <Card key={card.id} data={card}/>)}
      <CardCreator/>
    </div>
  );
}
