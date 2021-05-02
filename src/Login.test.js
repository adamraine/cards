import {render, screen} from '@testing-library/react';
import {SignIn, SignOut} from './Login';

jest.mock('firebase/app');

/** @type {firebase.default.auth.Auth} */
const auth = {
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  currentUser: {
    displayName: 'DISPLAYNAME',
    email: 'EMAIL',
  }
}

beforeEach(() => {
  const firebase = require('firebase/app');
  firebase.auth = () => auth;
  firebase.auth.GoogleAuthProvider = class {name = 'GAP'};
});

describe('SignIn', () => {
  it('opens popup to sign in', () => {
    render(<SignIn/>);

    const signInButton = screen.queryByText(/Sign in with Google/);
    expect(signInButton).toBeInTheDocument();

    signInButton.click();
    expect(auth.signInWithPopup).toBeCalledWith({name: 'GAP'});
  });
});

describe('SignOut', () => {
  it('signs out when button clicked', () => {
    render(<SignOut/>);

    const displayName = screen.queryByText(/DISPLAYNAME/);
    const email = screen.queryByText(/EMAIL/);
    const signOutButton = screen.queryByText(/Sign Out/);
    expect(displayName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();

    signOutButton.click();
    expect(auth.signOut).toBeCalled();
  });
});