import {db, UserContext} from '../firebase';
import {Card} from './Card';
import {CardForm} from './CardForm';
import {FloatingActionButton} from './util/FloatingActionButton';
import {Grid} from './util/Grid';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Deck.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Deck:React.FunctionComponent = () => {
  const popup = React.useContext(PopupContext);
  const cards = db.collection('cards');
  const {user} = React.useContext(UserContext);

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
      <FloatingActionButton onClick={() => popup.show(<CardForm></CardForm>)}>+</FloatingActionButton>
    </div>
  );
};
export default Deck;
