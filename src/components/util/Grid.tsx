import React from 'react';
import styles from './Grid.module.scss';

export const Grid:React.FC = (props) => {
  return (
    <div className={styles.Grid}>
      {props.children}
    </div>
  );
};
