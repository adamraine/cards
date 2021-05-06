import React from 'react';
import {shallow} from 'enzyme';
import App from '../components/App';
import {SignIn, SignOut} from '../components/Login';
import {Deck} from '../components/Deck';

jest.mock('react-firebase-hooks/auth');

/** @type {firebase.default.User} */
let user;

beforeEach(() => {
  require('react-firebase-hooks/auth').useAuthState = () => {
    return [user];
  }
});

it('renders sign in button when not signed in', () => {
  const app = shallow(<App/>);

  const signIn = app.find(SignIn);
  const signOut = app.find(SignOut);
  const deck = app.find(Deck);

  expect(signIn).toHaveLength(1);
  expect(signOut).toHaveLength(0);
  expect(deck).toHaveLength(0);
});

it('renders sign out button when signed in', () => {
  user = {
    uid: 'USER',
  };
  const app = shallow(<App/>);

  const signIn = app.find(SignIn);
  const signOut = app.find(SignOut);
  const deck = app.find(Deck);

  expect(signIn).toHaveLength(0);
  expect(signOut).toHaveLength(1);
  expect(deck).toHaveLength(1);
});
