import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import {Component} from 'react';

export class Card extends Component {
  constructor(props) {
    super(props);
    /** @type {string} */
    this.text = props.data.text;
    /** @type {string} */
    this.id = props.data.id;    
    this.state = {
      url: '',
    }

    /** @type {string} */
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
        this.setState({url})
      } else {
        this.state.url = url;
      }
    });

    /**
     * @type {React.FormEventHandler<HTMLFormElement>}
     */
    this.deleteCard = async () => {
      await imageRef.delete();
      await cards.doc(id).delete();
    }
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
