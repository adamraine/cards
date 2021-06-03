import * as React from 'react';
import {auth, db} from '../firebase';
import {Card} from './Card';
import {CardCreator} from './CardCreator';
import styles from './Deck.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export const Deck:React.FunctionComponent = () => {
  const cards = db.collection('cards');
  if (!auth.currentUser) throw new Error('User must be logged in.');
  const query = cards.where('uid', '==', auth.currentUser.uid).orderBy('createdAt').limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});

  return (
    <div className={styles.Deck}>
      <>
        {userCards && userCards.filter(card => card.uid).map(card => <div className={styles.CardHolder} key={card.id}><Card data={card}/></div>)}
        <CardCreator/>
      </>
    </div>
  );
};
