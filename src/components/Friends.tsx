import {db, firebase} from '../firebase';
import {UserCard, UserList} from './UserCard';
import React from 'react';
import styles from './Friends.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useFriendIds} from '../hooks';


export const Friends:React.FunctionComponent = () => {
  const [friendIds, friendsLoading] = useFriendIds();
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