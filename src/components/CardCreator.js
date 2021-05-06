import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import React, {Component} from 'react';

export class CardCreator extends Component {
  constructor() {
    super();
    const db = firebase.firestore();
    const cards = db.collection('cards');
    const storage = firebase.storage().ref();
    const auth = firebase.auth();
    
    /** @type {HTMLInputElement|null} */
    this.fileInput = null;

    /** @type {{text: string, image: File|null}} */
    this.state = {
      text: '',
      image: null,
    };
    /**
     * @param {string} text 
     */
    this.updateText = (text) => {
      this.setState(s => ({...s, text}));
    };
    /**
     * @param {File} image 
     */
    this.updateImage = (image) => {
      this.setState(s => ({...s, image}));
    };

    /**
     * @type {React.FormEventHandler<HTMLFormElement>}
     */
    this.createCard = async e => {
      e.preventDefault();
      if (!this.state.image) {
        alert('Please specify an image value.');
        return;
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
      this.fileInput.value = null;
    };
  }
  
  render() {
    return (
      <div className="CardCreator">
        <form onSubmit={this.createCard}>
          <input value={this.state.text} type="text" onChange={e => this.updateText(e.target.value)}></input>
          <input ref={ref => this.fileInput = ref} accept="image/*" type="file" onChange={e => this.updateImage(e.target.files[0])}></input>
          <button type="submit">Create card</button>
        </form>
      </div>
    );
  }
}
