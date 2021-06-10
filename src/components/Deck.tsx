import {auth, db} from '../firebase';
import {Card} from './Card';
import {CardCreator} from './CardCreator';
import {Grid} from './Grid';
import React from 'react';
import styles from './Deck.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Deck:React.FunctionComponent = () => {
  const cards = db.collection('cards');
  const [user] = useAuthState(auth);
  if (!user) throw new Error('User must be logged in.');

  const query = cards
    .where('uid', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});

  return (
    <div className={styles.Deck}>
      <Grid>
        {
          userCards && userCards.map(card => <Card key={card.id} card={card}/>)
        }
      </Grid>
      <CardCreator/>
    </div>
  );
};
export default Deck;
