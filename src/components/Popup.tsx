import React, {Suspense} from 'react';
import styles from './Popup.module.scss';

export interface PopupHandlers {
  dismiss: () => void;
  show: (node:React.ReactNode) => void;
}

export const PopupContext = React.createContext<PopupHandlers>({dismiss: () => undefined, show: () => undefined});

export const Popup:React.FC = (props) => {
  const popup = React.useContext(PopupContext);
  if (!props.children) return null;
  return (
    <Suspense fallback={null}>
      <div className={styles.Popup}>
        <div className={styles.background} onClick={popup.dismiss}></div>
        <div className={styles.content}>{props.children}</div>
      </div>
    </Suspense>
  );
};