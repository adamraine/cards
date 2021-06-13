import {useEffect, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export function useFriendsList(auth:firebase.default.auth.Auth, db: firebase.default.firestore.Firestore)
:[string[], boolean] {
  const [user, authLoading] = useAuthState(auth);
  if (authLoading) return [[], true];
  if (!user) throw ('User must be signed in');
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

type WindowSize = {width?: number, height?: number};
export function useWindowSize():WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({});
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