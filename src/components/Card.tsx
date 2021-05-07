import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import React, {Component} from 'react';

export class Card extends Component {

  text: string;
  id: string;
  deleteCard: React.MouseEventHandler<HTMLButtonElement>;
  state: {url: string};

  constructor(props: {data: {text: string, id: string, uid: string}}) {
    super(props);
    this.text = props.data.text;
    this.id = props.data.id;    
    this.state = {
      url: '',
    };

    const uid = props.data.uid;    

    let mounted = false;
    this.componentDidMount = () => mounted = true;

    const db = firebase.firestore();
    const cards = db.collection('cards');
    const storage = firebase.storage().ref();

    const {id} = this;
    const imageRef = storage.child(`images/${uid}/${id}`);
    imageRef.getDownloadURL().then(url => {
      if (mounted) {
        this.setState({url});
      } else {
        this.state.url = url;
      }
    });

    /**
     * @type {React.MouseEventHandler<HTMLButtonElement>}
     */
    this.deleteCard = async () => {
      await imageRef.delete();
      await cards.doc(id).delete();
    };
  }

  render() {
    return (
      <div className="Card">
        <img src={this.state.url} alt=""></img>
        <div>{this.text}</div>
        <button onClick={this.deleteCard}>Delete</button>
      </div>
    );
  }
}
