import * as PropTypes from 'prop-types';
import * as React from 'react';
import {Link} from 'react-router-dom';
import styles from './Menu.module.scss';

interface MenuItemProps {
  label: string,
  href: string,
}

export class MenuItem extends React.Component<MenuItemProps> {
  static propTypes:React.WeakValidationMap<MenuItemProps> = {
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  };
  
  render():JSX.Element {
    return (
      <Link
        className={styles.MenuItem}
        to={this.props.href}
      >
        {this.props.label}
      </Link>
    );
  }
}

interface MenuProps {
  children: React.ReactNode;
}

interface State {
  open: boolean;
}

export class Menu extends React.Component<MenuProps, State> {
  state = {
    open: false,
  }
  static propTypes = {children: PropTypes.node.isRequired};

  render():React.ReactNode {
    const classes = [styles.Menu];
    if (this.state.open) classes.push(styles.open);
    return (
      <div className={classes.join(' ')}>
        <div className={styles.icon} onClick={() => this.setState(s => ({open: !s.open}))}>=</div>
        <div className={styles.items}>
          {this.props.children}
        </div>
      </div>
    );
  }
}