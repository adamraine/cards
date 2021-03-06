import * as React from 'react';
import {shallow} from 'enzyme';
import App from '../src/components/App';
import {SignIn, SignOut} from '../src/components/Login';
import {Deck} from '../src/components/Deck';
import * as reactHooksAuth from 'react-firebase-hooks/auth';

jest.mock('react-firebase-hooks/auth');

let user: Partial<firebase.default.User>;

beforeEach(() => {
  // @ts-ignore
  reactHooksAuth.useAuthState = () => {
    return [user];
  };
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
