import {Link} from 'react-router-dom';
import React from 'react';
import styles from './Menu.module.scss';

export const MenuItem:React.FunctionComponent<{label: string, href: string}> = (props) => {
  return (
    <Link className={styles.MenuItem} to={props.href}>
      {props.label}
    </Link>
  );
};

export const Menu:React.FunctionComponent<{children: React.ReactNode}> = (props) => {
  const classes = [styles.Menu];
  return (
    <div className={classes.join(' ')}>
      <div className={styles.items}>
        {props.children}
      </div>
    </div>
  );
};