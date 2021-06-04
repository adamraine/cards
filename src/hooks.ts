import {useEffect, useState} from 'react';
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

type WindowSize = {width?: number, height?: number};
export function useWindowSize():WindowSize {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({});
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}