import React from 'react';
import styles from './FloatingActionButton.module.scss';

export const FloatingActionButton:React.FC<{onClick:React.MouseEventHandler}> = props => {
  return (
    <div className={styles.FloatingActionButton} onClick={props.onClick}>
      {props.children}
    </div>  
  );
};