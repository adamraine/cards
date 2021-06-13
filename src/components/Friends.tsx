import {auth, db, firebase} from '../firebase';
import React from 'react';
import styles from './Friends.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useFriendsList} from '../hooks';

const UserCard:React.FunctionComponent<{user: App.User}> = (props) => {
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
  const [friendsList, friendsLoading] = useFriendsList(auth, db);
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
      <button hidden={friendsLoading} disabled={isFriend} onClick={addFriend}>
        {isFriend ? 'Friends' : 'Add Friend'}
      </button>
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

export const Friends:React.FunctionComponent = () => {
  const [friendIds, friendsLoading] = useFriendsList(auth, db);
  const users = db.collection('users');
  
  const [search, setSearch] = React.useState('');
  
  const updateResults:React.ChangeEventHandler<HTMLInputElement> = event => {
    setSearch(event.target.value);
  };
  
  let query = users.where('name', '==', search);
  if (!search && friendIds.length) {
    query = users.where(firebase.firestore.FieldPath.documentId(), 'in', friendIds);
  }
  const [userList, usersLoading] = useCollectionData<App.User>(query, {idField: 'id'});

  return (
    <div className={styles.Friends}>
      <input type="text" placeholder="User search" value={search} onChange={updateResults}></input>
      {
        friendsLoading || usersLoading ?
          <h4>Loading...</h4> :
          userList && userList.length ?
            <UserList>
              {userList.map(user => <UserCard key={user.id} user={user}></UserCard>)}
            </UserList> :
            <h4>No users found :(</h4>
      }
    </div>
  );
};

export default Friends;