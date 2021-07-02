import {auth, db} from '../firebase';
import {RadioItem, RadioList, useRadioGroup} from './RadioList';
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
  
  const radioGroup = useRadioGroup<App.Card>();
  
  return (
    <RadioList onChange={() => undefined} group={radioGroup}>
      {
        userCards?.map(card => (
          <RadioItem key={card.id} group={radioGroup} value={card}>
            <Card card={card} disableFlip={true}></Card>
          </RadioItem>
        ))
      }
    </RadioList>
  );
};

export default Trade;