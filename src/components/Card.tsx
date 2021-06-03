import styles from './Card.module.scss';
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
  mounted: boolean;
  root: HTMLDivElement|null;
  content: HTMLDivElement|null;
  title: string;
  text: string;
  id: string;
  deleteCard: React.MouseEventHandler<HTMLButtonElement>;
  toggleFace: React.MouseEventHandler<HTMLElement>;
  getTransformStyle: () => React.CSSProperties;
  resizeCallback: () => void;
  state: State;

  static propTypes: PropTypes.InferProps<Props>;

  constructor(props: Props) {
    super(props);
    
    this.mounted = false;
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


    const cards = db.collection('cards');

    const {id} = this;
    const imageRef = storage.ref().child(`images/${uid}/${id}`);
    imageRef.getDownloadURL().then(url => {
      if (this.mounted) {
        this.setState({url});
      } else {
        this.state.url = url;
      }
    });

    this.deleteCard = async () => {
      await imageRef.delete();
      await cards.doc(id).delete();
    };
    
    this.toggleFace = async () => {
      if (this.root) {
        const root = this.root;
        root.classList.add(styles.rotate_left);

        await new Promise(r => root.ontransitionend = r).then(() => root.ontransitionend = null);

        root.classList.remove(styles.rotate_left);
        root.classList.add(styles.no_transition);
        root.classList.add(styles.rotate_right);
        this.setState(s => {
          return {
            face: s.face === 'front' ? 'back' : 'front',
          }
        });
        
        await new Promise(r => setTimeout(r));

        root.classList.remove(styles.rotate_right);
        root.classList.remove(styles.no_transition);
      }
    }
    
    this.getTransformStyle = () => {
      const transforms = [];
      if (this.content && this.root && this.content.offsetWidth > this.root.offsetWidth) {
        const scale = this.root.offsetWidth / this.content.offsetWidth;
        transforms.push(`scale(${scale})`);
      }
      return {
        transform: transforms.join(' '),
      }
    };
    
    this.resizeCallback = () => this.forceUpdate();
  }
  
  componentDidMount():void {
    this.mounted = true;
    window.addEventListener('resize', this.resizeCallback);
  }
  
  componentWillUnmount():void {
    window.removeEventListener('resize', this.resizeCallback);
  }
  
  render():JSX.Element {
    return (
      <div
        ref={ref => this.root = ref}
        onClick={this.toggleFace}
        className={[styles.Card, this.state.face === 'front' ? styles.show_front : styles.show_back].join(' ')}
      >
        <div
          ref={ref => this.content = ref}
          className={styles.content}
          style={this.getTransformStyle()}
        >
          <div className={styles.front}>
            <h3>{this.title}</h3>
            <img src={this.state.url} alt=""></img>
            <div>{this.text}</div>
          </div>
          <div className={styles.back}>
            <div>This is the back of a card.</div>
            <button onClick={this.deleteCard}>Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.shape<PropTypes.ValidationMap<App.Card>>({
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }),
}