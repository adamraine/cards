import {auth, db, firebase, storage} from '../firebase';
import Compress from 'compress.js';
import {PopupContext} from './Popup';
import React from 'react';
import styles from './CardCreator.module.scss';
import {useAuthState} from 'react-firebase-hooks/auth';

const compress = new Compress();

export const CardForm:React.FC<{
  onSubmit:React.EventHandler<React.SyntheticEvent>,
  onCancel:React.EventHandler<React.SyntheticEvent>
}> = props => {
  const cards = db.collection('cards');

  const [user] = useAuthState(auth);
  if (!user) {
    throw new Error('ERROR: User must be logged in.');
  }

  const fileInput = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState<File|null>(null);

  const updateTitle:React.ChangeEventHandler<HTMLInputElement> = event => {
    const title = event.target.value;
    setTitle(title);
  };

  const updateText:React.ChangeEventHandler<HTMLTextAreaElement> = event => {
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
  
  function cancel() {
    setTitle('');
    setText('');
    setImage(null);
    if (fileInput.current) fileInput.current.value = '';
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
  };

  return (
    <form className={styles.CardForm} onSubmit={e => {
      createCard(e);
      props.onSubmit(e);
    }}>
      <input placeholder="Title" value={title} type="text" onChange={updateTitle}></input>
      <div className={styles.image}>
        <input ref={fileInput} accept="image/*" type="file" onChange={updateImage}></input>
        {
          image ?
            <img src={URL.createObjectURL(image)}></img> :
            <div>+</div>
        }
      </div>
      <textarea placeholder="Text" value={text} onChange={updateText}></textarea>
      <button type="submit">Create card</button>
      <button className={styles.cancel} type="button" onClick={e => {
        cancel();
        props.onCancel(e);
      }}>Cancel</button>
    </form>
  );
};

export const CardCreator:React.FC = () => {
  const popup = React.useContext(PopupContext);
  return (
    <div className={styles.CardCreator} onClick={() => popup.show(
      <CardForm onSubmit={popup.dismiss} onCancel={popup.dismiss}></CardForm>
    )}>+</div>  
  );
};