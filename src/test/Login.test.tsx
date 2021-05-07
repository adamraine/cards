import React from 'react';
import {act} from '@testing-library/react';
import {shallow} from 'enzyme';
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
    const signIn = shallow(<SignIn/>);
    const button = signIn.find('button');

    act(() => {
      button.simulate('click');
    });

    // @ts-ignore
    expect(mockAuth.signInWithPopup).toBeCalledWith({providerId: 'google.com'});
  });
});

describe('SignOut', () => {
  it('signs out when button clicked', () => {
    const signOut = shallow(<SignOut/>);
    const button = signOut.find('button');

    act(() => {
      button.simulate('click');
    });

    // @ts-ignore
    expect(mockAuth.signOut).toBeCalled();
  });
});