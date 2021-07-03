import * as React from 'react';
import styles from './Popup.module.scss';

export interface PopupHandlers {
  dismiss: () => void;
  show: (node:React.ReactNode) => void;
}

export const PopupContext = React.createContext<PopupHandlers>({dismiss: () => undefined, show: () => undefined});

export const Popup:React.FC = (props) => {
  const popup = React.useContext(PopupContext);
  const classList = [styles.Popup];
  if (!props.children) classList.push(styles.hidden);
  return (
    <div className={classList.join(' ')}>
      <div className={styles.background} onClick={popup.dismiss}></div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};