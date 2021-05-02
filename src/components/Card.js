import firebase from 'firebase/app';
import 'firebase/firestore';

export function Card(props) {
  const db = firebase.firestore();
  const cards = db.collection('cards');
  const {text, id} = props.data;

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const deleteCard = async e => {
    e.preventDefault();
    await cards.doc(id).delete();
  }

  return (
    <div className="Card">
      <span>{text}</span>
      <button onClick={deleteCard}>Delete</button>
    </div>
  );
}
