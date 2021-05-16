import './Friends.scss';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {firebase, auth, db} from '../firebase';
import {useFriendsList as useFriendsIds} from '../hooks';

export function UserCard(props: PropTypes.InferProps<typeof UserCard.propTypes>):JSX.Element {
  const {user} = props;
  if (!auth.currentUser) throw new Error();
  const currentUser = auth.currentUser;
  const friendIds = useFriendsIds(auth, db);
  const isFriend = friendIds.includes(user.id);
  const friends = db.collection('friends');

  function addFriend(uid:string) {
    let uid1 = uid;
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
    <div key={user.id} className="UserCard">
      <img src={user.picture}></img>
      <span>{user.name}</span>
      <button disabled={isFriend} onClick={() => addFriend(user.id)}>
        {isFriend ? 'Friends' : 'Add Friend'}
      </button>
    </div>
  )
}
UserCard.propTypes = {
  user: PropTypes.shape<PropTypes.ValidationMap<App.User>>({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }).isRequired,
}

export function UserList(props: PropTypes.InferProps<typeof UserList.propTypes>):JSX.Element {
  const {userList} = props;
  return (
    <div className="UserList">
      {userList.map(user => <UserCard key={user.id} user={user}></UserCard>)}
    </div>
  );
}
UserList.propTypes = {
  userList: PropTypes.arrayOf(
    PropTypes.shape<PropTypes.ValidationMap<App.User>>({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

export function Friends():JSX.Element {
  const friendIds = useFriendsIds(auth, db);
  const users = db.collection('users');
  
  const [search, setSearch] = React.useState('');
  
  const updateResults:React.ChangeEventHandler<HTMLInputElement> = event => {
    setSearch(event.target.value);
  }
  
  let query = users.where('name', '==', search)
  if (!search && friendIds.length) {
    query = users.where(firebase.firestore.FieldPath.documentId(), 'in', friendIds);
  }
  const userList = useCollectionData<App.User>(query, {idField: 'id'})[0] || [];

  return (
    <div className="Friends">
      <input type="text" value={search} onChange={updateResults}></input>
      {
        userList.length ?
        <UserList userList={userList}></UserList> :
        <h4>No user found :(</h4>
      }
    </div>
  )
}