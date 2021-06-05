import * as PropTypes from 'prop-types';
import * as React from 'react';
import {Card} from './Card';
import {db} from '../firebase';
import styles from './Home.module.scss';
import {useCollectionData} from 'react-firebase-hooks/firestore';

export const Grid:React.FunctionComponent = (props) => {
  return (
    <div className={styles.Grid}>
      {props.children}
    </div>
  );
};
Grid.propTypes = {
  children: PropTypes.node,
};

export const Home:React.FunctionComponent = () => {
  const [cards] = useCollectionData<App.Card>(db.collection('cards'), {idField: 'id'});
  return (
    <div className={styles.Home}>
      <Grid>
        {cards?.map(card => <Card key={card.id} data={card}></Card>)}
      </Grid>
    </div>
  );
};