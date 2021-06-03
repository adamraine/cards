import * as React from 'react';
import {auth, db, firebase, storage} from '../firebase';
import styles from './CardCreator.module.scss';

type Props = Record<string, never>;

interface State {
  minified: boolean,
  title: string;
  text: string;
  image: File|null;
}

export class CardCreator extends React.Component<Props, State> {
  fileInput: React.RefObject<HTMLInputElement>;
  updateTitle: React.ChangeEventHandler<HTMLInputElement>;
  updateText: React.ChangeEventHandler<HTMLInputElement>;
  updateImage: React.ChangeEventHandler<HTMLInputElement>;
  minify: React.MouseEventHandler<HTMLElement>
  maximize: React.MouseEventHandler<HTMLElement>
  createCard: React.FormEventHandler<HTMLFormElement>;
  state: State;

  constructor(props: Props) {
    super(props);
    const cards = db.collection('cards');

    this.fileInput = React.createRef();

    this.state = {
      minified: true,
      title: '',
      text: '',
      image: null,
    };

    this.updateTitle = (event) => {
      const title = event.target.value;
      this.setState(s => ({...s, title}));
    };

    this.updateText = (event) => {
      const text = event.target.value;
      this.setState(s => ({...s, text}));
    };

    this.updateImage = (event) => {
      const files = event.target.files;
      const image = files && files[0];
      this.setState(s => ({...s, image}));
    };
    
    this.minify = () => this.setState({minified: true});
    this.maximize = () => this.setState({minified: false});

    this.createCard = async e => {
      e.preventDefault();
      if (!this.state.title) {
        alert('Please specify an image value.');
        return;
      }
      if (!this.state.image) {
        alert('Please specify an image value.');
        return;
      }
      if (!auth.currentUser) {
        throw new Error('ERROR: User must be logged in.');
      }
      const {uid} = auth.currentUser;
      const doc = cards.doc();
      await storage.ref().child(`images/${uid}/${doc.id}`).put(this.state.image);
      await doc.set({
        title: this.state.title,
        text: this.state.text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
      });
      this.setState({
        title: '',
        text: '',
        image: null,
        minified: true,
      });
      if (this.fileInput.current) this.fileInput.current.value = '';
    };
  }
  
  render():React.ReactNode {
    return (
      <div 
        className={[styles.CardCreator, this.state.minified ? styles.minified : styles.open].join(' ')}
        onClick={this.state.minified ? this.maximize : undefined}
      >
        {
          this.state.minified ?
            <div>+</div> :
            <>
              <form onSubmit={this.createCard}>
                <input value={this.state.title} type="text" onChange={this.updateTitle}></input>
                <input value={this.state.text} type="text" onChange={this.updateText}></input>
                <input ref={this.fileInput} accept="image/*" type="file" onChange={this.updateImage}></input>
                <button type="submit">Create card</button>
              </form>
              <button onClick={this.minify}>Minify</button>
            </>
        }
      </div>
    );
  }
}
