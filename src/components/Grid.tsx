import React from 'react';
import styles from './Grid.module.scss';

export const Grid:React.FunctionComponent = (props) => {
  return (
    <div className={styles.Grid}>
      {props.children}
    </div>
  );
};
