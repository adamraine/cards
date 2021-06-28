import {auth, db, storage} from '../firebase';
import {Confirmation} from './Confirmation';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './Card.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useDocumentData} from 'react-firebase-hooks/firestore';
import {useDownloadURL} from 'react-firebase-hooks/storage';
import {useWindowSize} from '../hooks';

export const Card:React.FunctionComponent<{card: App.Card}> = (props) => {
  useWindowSize();
  const root = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  
  const [face, setFace] = React.useState<'front'|'back'>('front');

  const cards = db.collection('cards');
  const users = db.collection('users');

  const {id, uid} = props.card;
  const imageRef = storage.ref().child(`images/${uid}/${id}`);
  const [imageUrl] = useDownloadURL(imageRef);
  const [user] = useDocumentData<App.User>(users.doc(uid));
  const [currentUser] = useAuthState(auth);
  if (!currentUser) {
    throw new Error('ERROR: User must be logged in.');
  }
  
  function deleteCard() {
    imageRef.delete();
    cards.doc(id).delete();
  }
  
  async function toggleFace() {
    if (!root.current) return;
    const current = root.current;

    current.classList.add(styles.rotate_left);

    await new Promise(r => current.addEventListener('transitionend', r, {once: true}));

    current.classList.remove(styles.rotate_left);
    current.classList.add(styles.no_transition);
    current.classList.add(styles.rotate_right);
    setFace(face === 'front' ? 'back' : 'front');
    
    await new Promise(r => setTimeout(r));

    current.classList.remove(styles.rotate_right);
    current.classList.remove(styles.no_transition);
  }
  
  function getTransformStyle() {
    if (!content.current || !root.current) return {};

    const currentContent = content.current;
    const currentRoot = root.current;

    if (currentContent.offsetWidth < currentRoot.offsetWidth) return {};

    const scale = currentRoot.offsetWidth / currentContent.offsetWidth;
    return {
      transform: `scale(${scale})`,
    };
  }
  
  const deleteButton = (
    <PopupContext.Consumer>
      {popup => (
        <button onClick={() => popup.show(
          <Confirmation onConfirm={deleteCard} dismiss={popup.dismiss}>
            Are you sure you want to delete this card?
          </Confirmation>
        )}>Delete</button>    
      )}
    </PopupContext.Consumer>
  );
  
  return (
    <div
      ref={root}
      onClick={toggleFace}
      className={[styles.Card, face === 'front' ? styles.show_front : styles.show_back].join(' ')}
    >
      <div
        ref={content}
        className={styles.content}
        style={getTransformStyle()}
      >
        <div className={styles.front}>
          <h3>{props.card.title}</h3>
          <img src={imageUrl} alt=""></img>
          <div>{props.card.text}</div>
        </div>
        <div className={styles.back}>
          <div>Owner: {user?.name}</div>
          <div>Created on: {props.card.createdAt?.toDate().toDateString()}</div>
          {
            uid === currentUser.uid ? 
              deleteButton :
              undefined
          }
        </div>
      </div>
    </div>
  );
};