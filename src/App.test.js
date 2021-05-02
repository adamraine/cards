import {render, screen} from '@testing-library/react';
import App from './App';

jest.mock('react-firebase-hooks/auth');
jest.mock('./Login.js');
jest.mock('./Deck.js');

/** @type {firebase.default.User} */
let user;

beforeEach(() => {
  require('react-firebase-hooks/auth').useAuthState = () => {
    return [user];
  }
  const login = require('./Login');
  login.SignIn = () => {
    return <div>SIGNIN</div>;
  }
  login.SignOut = () => {
    return <div>SIGNOUT</div>;
  }
  require('./Deck.js').Deck = () => {
    return <div>DECK</div>;
  }
})

it('renders sign in button when not signed in', () => {
  render(<App/>);
  const signInButton = screen.queryByText('SIGNIN');
  const deck = screen.queryByText('DECK');
  expect(deck).not.toBeInTheDocument();
  expect(signInButton).toBeInTheDocument();
});

it('renders sign out button when signed in', () => {
  user = {
    uid: 'USER',
  };
  render(<App/>);
  const signInButton = screen.queryByText('SIGNOUT');
  const deck = screen.queryByText('DECK');
  expect(deck).toBeInTheDocument();
  expect(signInButton).toBeInTheDocument();
});
