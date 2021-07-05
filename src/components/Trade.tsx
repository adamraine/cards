import {auth, db, storage} from '../firebase';
import {SelectionItem, useCheckboxGroup, useRadioGroup} from './util/Selection';
import {UserCard, UserList} from './UserCard';
import {Card} from './Card';
import {FloatingActionButton} from './util/FloatingActionButton';
import {Grid} from './Grid';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Trade.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useFriends} from '../hooks';

const SendForm:React.FC<{cards: App.Card[], friends: App.User[]}> = props => {
  const popup = React.useContext(PopupContext);
  const [toFriend, group] = useRadioGroup<App.User>();
  
  async function tradeCards() {
    if (!toFriend) return;
    const tradePromises = props.cards.map(async card => {
      const doc = db.collection('cards').doc(card.id);
      
      // Move storage
      const ref = storage.ref().child(`images/${card.uid}/${doc.id}`);
      const newRef = storage.ref().child(`images/${toFriend.id}/${doc.id}`);
      const imageURL = await ref.getDownloadURL();
      if (!imageURL) return;
      const file = await fetch(imageURL).then(r => r.arrayBuffer());
      await newRef.put(file);
      await ref.delete();
      
      // Move doc
      card.uid = toFriend.id;
      await doc.set(card);
    });
    await Promise.all(tradePromises);
    popup.dismiss();
  }
  
  return (
    <div className={styles.SendForm}>
      <UserList>
        {
          props.friends.map(user =>
            <SelectionItem
              className={styles.SelectionItem}
              selectedClassName={styles.selected}
              group={group}
              key={user.id}
              value={user}
            >
              <div className={styles.container}>
                <UserCard user={user} hideFriendStatus={true}></UserCard>
              </div>
            </SelectionItem>
          )
        }
      </UserList>
      <button onClick={tradeCards} disabled={!toFriend}>Send</button>
    </div>
  );
};

const Trade:React.FC = () => {
  const popup = React.useContext(PopupContext);
  const [selected, group] = useCheckboxGroup<App.Card>();
  const cards = db.collection('cards');
  const [user] = useAuthState(auth);
  if (!user) throw new Error('User must be logged in.');

  const query = cards
    .where('uid', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [cardList] = useCollectionData<App.Card>(query, {idField: 'id'});
  const [friends, loading] = useFriends();
  
  return (
    <div className={styles.Trade}>
      <Grid>
        {
          cardList?.map(card => (
            <SelectionItem
              className={styles.SelectionItem}
              selectedClassName={styles.selected}
              key={card.id}
              group={group}
              value={card}
            >
              <div className={styles.container}>
                <Card card={card} disableFlip={true}></Card>
              </div>
            </SelectionItem>
          ))
        }
      </Grid>
      {
        selected.length && friends.length && !loading ?
          <FloatingActionButton onClick={() => popup.show(
            <SendForm cards={selected} friends={friends}></SendForm>
          )}>➤</FloatingActionButton> :
          undefined
      }
    </div>
  );
};

export default Trade;