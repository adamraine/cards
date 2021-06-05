import * as React from 'react';
import {db, storage} from '../firebase';
import styles from './Card.module.scss';
import {useDocumentData} from 'react-firebase-hooks/firestore';
import {useDownloadURL} from 'react-firebase-hooks/storage';
import {useWindowSize} from '../hooks';

interface Props {
  data: App.Card;
  width?: number|string;
}

export const Card:React.FunctionComponent<Props> = (props) => {
  useWindowSize();
  const root = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  
  const [face, setFace] = React.useState<'front'|'back'>('front');

  const cards = db.collection('cards');
  const users = db.collection('users');

  const {id, uid} = props.data;
  const imageRef = storage.ref().child(`images/${uid}/${id}`);
  const [imageUrl] = useDownloadURL(imageRef);
  const [user] = useDocumentData<App.User>(users.doc(uid));
  
  function deleteCard() {
    imageRef.delete();
    cards.doc(id).delete();
  }
  
  async function toggleFace() {
    if (!root.current) return;
    const current = root.current;

    current.classList.add(styles.rotate_left);

    await new Promise(r => current.ontransitionend = r)
      .then(() => current.ontransitionend = null);

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
  
  return (
    <div
      ref={root}
      onClick={toggleFace}
      className={[styles.Card, face === 'front' ? styles.show_front : styles.show_back].join(' ')}
      style={{width: props.width}}
    >
      <div
        ref={content}
        className={styles.content}
        style={getTransformStyle()}
      >
        <div className={styles.front}>
          <h3>{props.data.title}</h3>
          <img src={imageUrl} alt=""></img>
          <div>{props.data.text}</div>
        </div>
        <div className={styles.back}>
          <div>This is the back of a card.</div>
          <div>Owner: {user?.name}</div>
          <button onClick={deleteCard}>Delete</button>
        </div>
      </div>
    </div>
  );
};