import * as React from 'react';
import {Link} from 'react-router-dom';
import styles from './Menu.module.scss';

export const MenuItem:React.FunctionComponent<{label: string, href: string}> = (props) => {
  return (
    <Link className={styles.MenuItem} to={props.href}>
      {props.label}
    </Link>
  );
};

export const Menu:React.FunctionComponent<{children: React.ReactNode}> = (props) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const listener = () => open && setOpen(false);
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  });
  const classes = [styles.Menu];
  if (open) classes.push(styles.open);
  return (
    <div className={classes.join(' ')}>
      <div className={styles.icon} onClick={() => setOpen(!open)}>=</div>
      <div className={styles.items}>
        {props.children}
      </div>
    </div>
  );
};