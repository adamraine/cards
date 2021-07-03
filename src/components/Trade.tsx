import {auth, db, storage} from '../firebase';
import {Radio, RadioItem, useRadioGroup} from './Radio';
import {Selection, SelectionItem, useSelectionGroup} from './Selection';
import {UserCard, UserList} from './Friends';
import {Card} from './Card';
import {FloatingActionButton} from './FloatingActionButton';
import {Grid} from './Grid';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Trade.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useFriends} from '../hooks';

const SendForm:React.FC<{cards: App.Card[], friends: App.User[]}> = props => {
  const popup = React.useContext(PopupContext);
  const [toFriend, setToFriend] = React.useState<App.User|null>(null);
  const radioGroup = useRadioGroup<App.User>();
  
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
        <Radio onChange={user => setToFriend(user)} group={radioGroup}>
          {
            props.friends.map(user => <RadioItem group={radioGroup} key={user.id} value={user}>
              <UserCard user={user} hideFriendStatus={true}></UserCard>
            </RadioItem>)
          }
        </Radio>
      </UserList>
      <button onClick={tradeCards} disabled={!toFriend}>Send</button>
    </div>
  );
};

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
  const [friends, loading] = useFriends();
  
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
      {
        selected.size && friends.length && !loading ?
          <FloatingActionButton onClick={() => popup.show(
            <SendForm cards={Array.from(selected)} friends={friends}></SendForm>
          )}>➤</FloatingActionButton> :
          undefined
      }
    </div>
  );
};

export default Trade;