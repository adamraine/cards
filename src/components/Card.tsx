import './Card.scss';
import {db, storage} from '../firebase';
import * as React from 'react';
import * as PropTypes from 'prop-types';

interface Props {
  data: App.Card;
}

interface State {
  url: string;
  face: 'front'|'back';
  transforms: Set<string>;
}

export class Card extends React.Component<Props, State> {
  root: HTMLDivElement|null;
  content: HTMLDivElement|null;
  title: string;
  text: string;
  id: string;
  deleteCard: React.MouseEventHandler<HTMLButtonElement>;
  toggleFace: React.MouseEventHandler<HTMLElement>;
  state: State;

  static propTypes: PropTypes.InferProps<Props>;

  constructor(props: Props) {
    super(props);
    
    this.root = null;
    this.content = null;
    
    this.title = props.data.title;
    this.text = props.data.text;
    this.id = props.data.id;
    this.state = {
      url: '',
      face: 'front',
      transforms: new Set(),
    };

    const uid = props.data.uid;

    let mounted = false;
    this.componentDidMount = () => mounted = true;

    const cards = db.collection('cards');

    const {id} = this;
    const imageRef = storage.ref().child(`images/${uid}/${id}`);
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
    
    this.toggleFace = () => {
      this.setState(s => {
        return {
          face: s.face === 'front' ? 'back' : 'front',
        }
      })
    }
  }

  render():JSX.Element {
    if (this.content && this.root && this.content.offsetWidth > this.root.offsetWidth) {
      const scale = this.root.offsetWidth / this.content.offsetWidth;
      this.content.style.transform = `scale(${scale})`;
    }
    return (
      <div ref={ref => this.root = ref} onClick={this.toggleFace} className="Card">
        <div ref={ref => this.content = ref} className={'content ' + this.state.face}>
          <div className="front">
            <h3>{this.title}</h3>
            <img src={this.state.url} alt=""></img>
            <div>{this.text}</div>
            <button onClick={this.deleteCard}>Delete</button>
          </div>
          <div className="back">
            <div>This is the back of a card.</div>
          </div>
        </div>
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