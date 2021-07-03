import {auth, db} from '../firebase';
import {Radio, RadioItem, useRadioGroup} from './Radio';
import {Selection, SelectionItem, useSelectionGroup} from './Selection';
import {Card} from './Card';
import {FloatingActionButton} from './Utils';
import {Grid} from './Grid';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Trade.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Trade:React.FC = () => {
  const popup = React.useContext(PopupContext);
  const [selected, setSelected] = React.useState<Set<App.Card>>(new Set());
  const cards = db.collection('cards');
  const [user] = useAuthState(auth);
  if (!user) throw new Error('User must be logged in.');

  const query = cards
    .where('uid', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [cardList] = useCollectionData<App.Card>(query, {idField: 'id'});
  
  const radioGroup = useSelectionGroup<App.Card>();
  
  return (
    <div className={styles.Trade}>
      <Selection onChange={s => setSelected(s)} group={radioGroup}>
        <Grid>
          {
            cardList?.map(card => (
              <SelectionItem key={card.id} group={radioGroup} value={card}>
                <Card card={card} disableFlip={true}></Card>
              </SelectionItem>
            ))
          }
        </Grid>
      </Selection>
      <FloatingActionButton onClick={() => popup.show(<h1>HI</h1>)}>✉</FloatingActionButton>
    </div>
  );
};

export default Trade;