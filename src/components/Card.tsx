import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import * as React from 'react';
import * as PropTypes from 'prop-types';

interface Props {
  data: App.Card;
}

interface State {
  url: string;
}

export class Card extends React.Component<Props, State> {
  text: string;
  id: string;
  deleteCard: React.MouseEventHandler<HTMLButtonElement>;
  state: State;

  static propTypes: PropTypes.InferProps<Props>;

  constructor(props: Props) {
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

    this.deleteCard = async () => {
      await imageRef.delete();
      await cards.doc(id).delete();
    };
  }

  render():JSX.Element {
    return (
      <div className="Card">
        <img src={this.state.url} alt=""></img>
        <div>{this.text}</div>
        <button onClick={this.deleteCard}>Delete</button>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string,
    id: PropTypes.string,
    uid: PropTypes.string,
  }),
}