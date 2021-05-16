import {useCollectionData} from 'react-firebase-hooks/firestore';

export function useFriendsList(auth:firebase.default.auth.Auth, db: firebase.default.firestore.Firestore):string[] {
  if (!auth.currentUser) throw ('User must be signed in');
  const {uid} = auth.currentUser;
  const friends = db.collection('friends');
  const query1 = friends.where('uid1', '==', uid);
  const query2 = friends.where('uid2', '==', uid);
  const friendsList1 = useCollectionData<App.Friend>(query1)[0] || [];
  const friendsList2 = useCollectionData<App.Friend>(query2)[0] || [];
  return [
    ...friendsList1.map(f => f.uid2),
    ...friendsList2.map(f => f.uid1),
  ];
}