import {auth, db} from '../firebase';
import React from 'react';
import styles from './UserCard.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useFriendIds} from '../hooks';

export const UserCard:React.FunctionComponent<{user: App.User, hideFriendStatus?:boolean}> = (props) => {
  const {user} = props;

  const [currentUser, authLoading] = useAuthState(auth);
  if (authLoading) {
    return (
      <div key={user.id} className={styles.UserCard}>
        <span>Loading...</span>
      </div>
    );
  }

  const friends = db.collection('friends');
  const [friendsList, friendsLoading] = useFriendIds();
  const isFriend = friendsList.includes(user.id);

  function addFriend() {
    if (!currentUser) throw new Error();
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
    <div key={user.id} className={styles.UserCard}>
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

export const UserList:React.FunctionComponent<{children: React.ReactNode}> = (props) => {
  return (
    <div className={styles.UserList}>
      {props.children}
    </div>
  );
};