import {Card} from './Card';
import {db} from '../firebase';
import {Grid} from './Grid';
import React from 'react';
import styles from './Home.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Home:React.FunctionComponent = () => {
  const [cards] = useCollectionData<App.Card>(db.collection('cards').orderBy('createdAt', 'desc'), {idField: 'id'});
  return (
    <div className={styles.Home}>
      <Grid>
        {cards?.map(card => <Card key={card.id} card={card}></Card>)}
      </Grid>
    </div>
  );
};
export default Home;