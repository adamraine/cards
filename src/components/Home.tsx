import {db} from '../firebase';
import {Grid} from './util/Grid';
import React from 'react';
import styles from './Home.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

const Card = React.lazy(() => import('./Card'));

const Home:React.FC = () => {
  const [cards] = useCollectionData<App.Card>(db.collection('cards').orderBy('createdAt', 'desc'), {idField: 'id'});
  return (
    <div className={styles.Home}>
      <Grid>
        {cards?.map(card =>
          <Card key={card.id} card={card}></Card>
        )}
      </Grid>
    </div>
  );
};

export default Home;