import {render, screen, fireEvent} from '@testing-library/react';
import {mockAuth, mockFirestore} from './mock-firebase';
import {CardCreator} from '../components/CardCreator';

jest.mock('firebase/app');
jest.mock('react');
jest.mock('react-firebase-hooks/firestore');

/** @type {React.Dispatch<React.SetStateAction<string>>} */
let setFormValue;
/** @type {firebase.default.firestore.CollectionReference<firebase.default.firestore.DocumentData>} */
let mockCollection;

beforeEach(() => {
  mockAuth.currentUser = {
    uid: 'USERID',
  }
  
  mockCollection = {
    add: jest.fn(),
  }
  mockFirestore.collection = jest.fn().mockReturnValue(mockCollection);

  setFormValue = jest.fn();
  require('react').useState
    = jest.fn().mockReturnValue(['FORMVALUE', setFormValue]);
});

it('updates state on change', () => {
  render(<CardCreator/>);
  const input = screen.queryByDisplayValue(/FORMVALUE/);
  expect(input).toBeInTheDocument();
  
  fireEvent.change(input, {target: {value: 'NEWVALUE'}});
  expect(setFormValue).toHaveBeenCalledWith('NEWVALUE');
});

it('adds new card when button clicked', () => {
  render(<CardCreator/>);
  const createCardButton = screen.queryByText(/Create card/);
  expect(createCardButton).toBeInTheDocument();
  
  createCardButton.click();
  expect(mockCollection.add).toHaveBeenCalledWith({
    text: 'FORMVALUE',
    createdAt: {type: 'serverTimestamp'},
    uid: 'USERID',
  });
});
