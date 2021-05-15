import './Menu.scss';
import * as React from 'react';
import * as PropTypes from 'prop-types';

interface MenuItemProps {
  label: string,
  href: string,
}

export class MenuItem extends React.Component<MenuItemProps> {
  static propTypes = {
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  };
  
  render():JSX.Element {
    return (
      <div className="MenuItem">
        <a href={this.props.href}>{this.props.label}</a>
      </div>
    )
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

  render():JSX.Element {
    const classes = ['Menu']
    if (this.state.open) classes.push('open');
    return (
      <div className={classes.join(' ')}>
        <div className="icon" onClick={() => this.setState(s => ({open: !s.open}))}>=</div>
        <div className="items">
          {this.props.children}
        </div>
      </div>
    );
  }
}