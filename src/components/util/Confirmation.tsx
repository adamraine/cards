import * as React from 'react';
import {PopupContext} from '../Popup';
import styles from './Confirmation.module.scss';

export const Confirmation:React.FC<{
  onConfirm?: React.EventHandler<React.SyntheticEvent>;
  onCancel?: React.EventHandler<React.SyntheticEvent>;
}> = (props) => {
  const popup = React.useContext(PopupContext);
  return (
    <div className={styles.Confirmation}>
      <div className={styles.text}>{props.children}</div>
      <button className={styles.confirm} onClick={e => {
        props.onConfirm?.(e);
        popup.dismiss();
      }}>Confirm</button>
      <button className={styles.cancel} onClick={e => {
        props.onCancel?.(e);
        popup.dismiss();
      }}>Cancel</button>
    </div>
  );
};