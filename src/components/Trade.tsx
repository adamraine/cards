import {auth, db} from '../firebase';
import {SelectionItem, SelectionList} from './SelectionList';
import {Card} from './Card';
import React from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Trade:React.FC = () => {
  const cards = db.collection('cards');
  const [user] = useAuthState(auth);
  if (!user) throw new Error('User must be logged in.');

  const query = cards
    .where('uid', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});
  
  return (
    <SelectionList onChange={() => undefined}>
      {
        userCards?.map(card => (
          <SelectionItem key={card.id}>
            <Card card={card} disableFlip={true}></Card>
          </SelectionItem>
        ))
      }
    </SelectionList>
  );
};

export default Trade;