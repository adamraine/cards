import React from 'react';
import styles from './Utils.module.scss';

export const FloatingActionButton:React.FC<{onClick:React.MouseEventHandler}> = props => {
  return (
    <div className={styles.FloatingActionButton} onClick={props.onClick}>
      {props.children}
    </div>  
  );
};