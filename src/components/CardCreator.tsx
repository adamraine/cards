import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import * as React from 'react';

interface State {
  text: string;
  image: File|null;
};

export class CardCreator extends React.Component<{}, State> {
  fileInput: HTMLInputElement|null;
  updateText: React.ChangeEventHandler<HTMLInputElement>;
  updateImage: React.ChangeEventHandler<HTMLInputElement>;
  createCard: React.FormEventHandler<HTMLFormElement>;
  state: State;

  constructor(props: {}) {
    super(props);
    const db = firebase.firestore();
    const cards = db.collection('cards');
    const storage = firebase.storage().ref();
    const auth = firebase.auth();

    this.fileInput = null;

    this.state = {
      text: '',
      image: null,
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

    this.createCard = async e => {
      e.preventDefault();
      if (!this.state.image) {
        alert('Please specify an image value.');
        return;
      }
      if (!auth.currentUser) {
        throw new Error('ERROR: User must be logged in.');
      }
      const {uid} = auth.currentUser;
      const doc = cards.doc();
      await storage.child(`images/${uid}/${doc.id}`).put(this.state.image);
      await doc.set({
        text: this.state.text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
      });
      this.setState({
        text: '',
        image: null,
      });
      if (this.fileInput) this.fileInput.value = '';
    };
  }

  render() {
    return (
      <div className="CardCreator">
        <form onSubmit={this.createCard}>
          <input value={this.state.text} type="text" onChange={this.updateText}></input>
          <input ref={ref => this.fileInput = ref} accept="image/*" type="file" onChange={this.updateImage}></input>
          <button type="submit">Create card</button>
        </form>
      </div>
    );
  }
}
