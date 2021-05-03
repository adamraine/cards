import {render, screen} from '@testing-library/react';
import {mockAuth} from './mock-firebase';
import {SignIn, SignOut} from '../components/Login';

jest.mock('firebase/app');

beforeEach(() => {
  Object.assign(mockAuth, {
    signInWithPopup: jest.fn(), 
    signOut: jest.fn(),
    currentUser: {
      displayName: 'DISPLAYNAME',
      email: 'EMAIL',
    },
  });
});

describe('SignIn', () => {
  it('opens popup to sign in', () => {
    render(<SignIn/>);

    const signInButton = screen.queryByText(/Sign in with Google/);
    expect(signInButton).toBeInTheDocument();

    signInButton.click();
    expect(mockAuth.signInWithPopup).toBeCalledWith({providerId: 'google.com'});
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
    expect(mockAuth.signOut).toBeCalled();
  });
});