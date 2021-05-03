import {render, screen} from '@testing-library/react';
import {mockAuth} from './mock-firebase';
import {Deck} from '../components/Deck';

jest.mock('firebase/app');
jest.mock('react-firebase-hooks/firestore');
jest.mock('../components/Card');

/** @type {Data<firebase.default.firestore.DocumentData, '', ''>[]} */
let mockCards;

beforeEach(() => {
  mockAuth.currentUser = {
    uid: 'USERID',
  };
  
  mockCards = null;
  require('react-firebase-hooks/firestore').useCollectionData
    = jest.fn().mockImplementation(() => [mockCards]);
  
  require('../components/Card').Card
    = jest.fn().mockImplementation(args => <div>{args.data.text}</div>);
});

it('creates list if cards', () => {
  mockCards = [
    {id: '1', text: 'CARD1'},
    {id: '2', text: 'CARD2'},
  ];
  render(<Deck/>);
  const cards = screen.queryAllByText(/CARD/);
  expect(cards).toHaveLength(2);
});

it('does not creat cards if query returns none', () => {
  render(<Deck/>);
  const cards = screen.queryAllByText(/CARD/);
  expect(cards).toHaveLength(0);
})