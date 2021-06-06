import * as React from 'react';
import {auth, db, firebase, storage} from '../firebase';
import Compress from 'compress.js';
import styles from './CardCreator.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';

const compress = new Compress();

export const CardCreator:React.FunctionComponent = () => {
  const cards = db.collection('cards');

  const [user] = useAuthState(auth);
  if (!user) {
    throw new Error('ERROR: User must be logged in.');
  }

  const fileInput = React.useRef<HTMLInputElement>(null);
  const [minified, setMinified] = React.useState(true);
  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState<File|null>(null);

  const updateTitle:React.ChangeEventHandler<HTMLInputElement> = event => {
    const title = event.target.value;
    setTitle(title);
  };

  const updateText:React.ChangeEventHandler<HTMLInputElement> = event => {
    const text = event.target.value;
    setText(text);
  };

  const updateImage:React.ChangeEventHandler<HTMLInputElement> = event => {
    const files = event.target.files;
    const image = files && files[0];
    setImage(image);
  };
  
  async function uploadImage(file:File, uid:string) {
    const [res] = await compress.compress([file], {
      maxWidth: 500,
      maxHeight: 500,
      resize: true,
    });
    const resized = Compress.convertBase64ToFile(res.data, 'image/webp');

    const doc = cards.doc();
    await storage.ref().child(`images/${uid}/${doc.id}`).put(resized);
    doc.set({
      title,
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    });
  }
  
  const createCard:React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    if (!title) {
      alert('Please specify an title value.');
      return;
    }
    if (!image) {
      alert('Please specify an image value.');
      return;
    }
    
    uploadImage(image, user.uid);
    
    setTitle('');
    setText('');
    setImage(null);
    setMinified(true);
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <div 
      className={[styles.CardCreator, minified ? styles.minified : styles.open].join(' ')}
      onClick={minified ? () => setMinified(false) : undefined}
    >
      {
        minified ?
          <div>+</div> :
          <>
            <form onSubmit={createCard}>
              <input value={title} type="text" onChange={updateTitle}></input>
              <input value={text} type="text" onChange={updateText}></input>
              <input ref={fileInput} accept="image/*" type="file" onChange={updateImage}></input>
              <button type="submit">Create card</button>
            </form>
            <button onClick={() => setMinified(true)}>Minify</button>
          </>
      }
    </div>
  );
};
