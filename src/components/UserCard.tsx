import {db, UserContext} from '../firebase';
import React from 'react';
import styles from './UserCard.module.scss';
import {useFriendIds} from '../hooks';

export const UserCard:React.FunctionComponent<{user: App.User, hideFriendStatus?:boolean}> = (props) => {
  const {user} = props;
  const {user: currentUser} = React.useContext(UserContext);
  const friends = db.collection('friends');
  const [friendsList, friendsLoading] = useFriendIds();
  const isFriend = friendsList.includes(user.id);

  function addFriend() {
    let uid1 = user.id;
    let uid2 = currentUser.uid;
    if (uid1 > uid2) {
      const temp = uid1;
      uid1 = uid2;
      uid2 = temp;
    }
    const doc = friends.doc(`${uid1},${uid2}`);
    doc.set({uid1, uid2});
  }
  
  return (
    <div className={styles.UserCard}>
      {
        user.picture ?
          <img className={styles.profile} src={user.picture}></img> :
          <span className={styles.profile}></span>
      }
      <span className={styles.name}>{user.name}</span>
      {
        props.hideFriendStatus ?
          undefined : 
          <button hidden={friendsLoading} disabled={isFriend} onClick={addFriend}>
            {isFriend ? 'Friends' : 'Add Friend'}
          </button>
      }
    </div>
  );
};