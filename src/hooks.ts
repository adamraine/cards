import {db, firebase, UserContext} from './firebase';
import {useContext, useEffect, useState} from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export function useFriendIds():[string[], boolean] {
  const {user} = useContext(UserContext);
  const friends = db.collection('friends');
  const query1 = friends.where('uid1', '==', user.uid);
  const query2 = friends.where('uid2', '==', user.uid);
  const [friends1, loading1] = useCollectionData<App.Friend>(query1);
  const [friends2, loading2] = useCollectionData<App.Friend>(query2);
  if (loading1 || loading2) return [[], true];
  return [
    [
      ...(friends1 || []).map(f => f.uid2),
      ...(friends2 || []).map(f => f.uid1),
    ],
    false,
  ];
}

export function useFriends():[App.User[], boolean] {
  const [friendIds, friendIdsLoading] = useFriendIds();

  let query:firebase.firestore.Query|null = null;
  if (friendIds.length) {
    query = db.collection('users').where(firebase.firestore.FieldPath.documentId(), 'in', friendIds);
  }

  const [userList, usersLoading] = useCollectionData<App.User>(query, {idField: 'id'});
  return [userList || [], friendIdsLoading || usersLoading];
}

type WindowSize = {width: number, height: number}|null;
export function useWindowSize():WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(null);
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}

export function useFormFactor():'mobile'|'desktop' {
  const size = useWindowSize();
  return size && size.width < 600 ? 'mobile' : 'desktop';
}