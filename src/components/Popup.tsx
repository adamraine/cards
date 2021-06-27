import * as React from 'react';
import styles from './Popup.module.scss';

interface PopupHandlers {
  dismiss: () => void;
  show: (node:React.ReactNode) => void;
}

export const PopupContext = React.createContext<PopupHandlers>({dismiss: () => undefined, show: () => undefined});

export const Popup:React.FC = (props) => {
  const classList = [styles.Popup];
  if (!props.children) classList.push(styles.hidden);
  return (
    <PopupContext.Consumer>
      {value => (
        <div className={classList.join(' ')}>
          <div className={styles.background} onClick={value.dismiss}></div>
          <div className={styles.content}>{props.children}</div>
        </div>
      )}
    </PopupContext.Consumer>
  );
};