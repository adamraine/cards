import {Link} from 'react-router-dom';
import React from 'react';
import styles from './Menu.module.scss';

export const MenuItem:React.FC<{label: string, href: string}> = (props) => {
  return (
    <div className={styles.MenuItem}>
      <Link to={props.href}>
        {props.label}
      </Link>
    </div>
  );
};

export const NavigationMenu:React.FC<{children: React.ReactNode}> = (props) => {
  return (
    <div className={styles.NavigationMenu}>
      <div className={styles.items}>
        {props.children}
      </div>
    </div>
  );
};

export const HamburgerMenu:React.FC<{children: React.ReactNode}> = (props) => {
  const icon = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const classList = [styles.HamburgerMenu];
  if (open) classList.push(styles.open);
  
  React.useEffect(() => {
    function closeMenu(e:MouseEvent) {
      if (e.target === icon.current) return;
      setOpen(false);
    }
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);
  
  return (
    <div className={classList.join(' ')}>
      <div ref={icon} className={styles.icon} onClick={() => setOpen(s => !s)}>☰</div>
      <div className={styles.items}>
        {props.children}
      </div>
    </div>
  );
};