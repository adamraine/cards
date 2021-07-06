import {db, UserContext} from '../firebase';
import {FloatingActionButton} from './util/FloatingActionButton';
import {Grid} from './util/Grid';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Deck.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Card = React.lazy(() => import('./Card'));

const Deck:React.FC = () => {
  const popup = React.useContext(PopupContext);
  const cards = db.collection('cards');
  const {user} = React.useContext(UserContext);

  const query = cards
    .where('uid', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [userCards] = useCollectionData<App.Card>(query, {idField: 'id'});
  
  async function openCardForm() {
    const CardForm = await import('./CardForm');
    popup.show(<CardForm.default/>);
  }

  return (
    <div className={styles.Deck}>
      <Grid>
        {
          userCards && userCards.map(card => <Card key={card.id} card={card}/>)
        }
      </Grid>
      <FloatingActionButton onClick={openCardForm}>+</FloatingActionButton>
    </div>
  );
};

export default Deck;
