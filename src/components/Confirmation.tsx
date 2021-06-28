import * as React from 'react';
import styles from './Confirmation.module.scss';

export const Confirmation:React.FC<{
  onConfirm?: React.EventHandler<React.SyntheticEvent>;
  onCancel?: React.EventHandler<React.SyntheticEvent>;
  dismiss: () => void;
}> = (props) => {
  return (
    <div className={styles.Confirmation}>
      <div className={styles.text}>{props.children}</div>
      <button className={styles.confirm} onClick={e => {
        props.onConfirm?.(e);
        props.dismiss();
      }}>Confirm</button>
      <button className={styles.cancel} onClick={e => {
        props.onCancel?.(e);
        props.dismiss();
      }}>Cancel</button>
    </div>
  );
};