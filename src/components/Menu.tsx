import {Link, useLocation} from 'react-router-dom';
import React from 'react';
import styles from './Menu.module.scss';
import {useFormFactor} from '../hooks';

export const MenuItem:React.FC<{label: string, pathname: string}> = (props) => {
  const location = useLocation();
  const formFactor = useFormFactor();
  const classList = [styles.MenuItem];
  if (location.pathname === props.pathname) classList.push(styles.selected);
  if (formFactor === 'mobile') classList.push(styles.hide_underline);
  return (
    <div className={classList.join(' ')}>
      <Link to={props.pathname}>
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
  }, [icon]);
  
  return (
    <div className={classList.join(' ')}>
      <div ref={icon} className={styles.icon} onClick={() => setOpen(s => !s)}>☰</div>
      <div className={styles.items}>
        {props.children}
      </div>
    </div>
  );
};