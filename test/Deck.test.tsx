import * as React from 'react';
import {shallow} from 'enzyme';
import {mockAuth} from './mock-firebase';
import {Deck} from '../src/components/Deck';
import {Card} from '../src/components/Card';
import {CardCreator} from '../src/components/CardCreator';
import * as reactHooksFirestore from 'react-firebase-hooks/firestore';

jest.mock('firebase/app');
jest.mock('react-firebase-hooks/firestore');

let mockCards: any[];

beforeEach(() => {
  mockAuth.currentUser = {
    uid: 'USERID',
  };

  mockCards = null;
  // @ts-ignore
  reactHooksFirestore.useCollectionData
    = jest.fn().mockImplementation(() => [mockCards]);
});

it('creates list if cards', () => {
  mockCards = [
    {id: '1', text: 'CARD1', uid: 'A'},
    {id: '2', text: 'CARD2', uid: 'B'},
  ];
  const deck = shallow(<Deck/>);
  const cards = deck.find(Card);
  const cardCreator = deck.find(CardCreator);

  expect(cards).toHaveLength(2);
  expect(cardCreator).toHaveLength(1);
});

it('ignores card with no uid', () => {
  mockCards = [
    {id: '1', text: 'CARD1'},
    {id: '2', text: 'CARD2', uid: 'B'},
  ];
  const deck = shallow(<Deck/>);
  const cards = deck.find(Card);

  expect(cards).toHaveLength(1);
});

it('does not creat cards if query returns none', () => {
  const deck = shallow(<Deck/>);
  const cards = deck.find(Card);
  const cardCreator = deck.find(CardCreator);

  expect(cards).toHaveLength(0);
  expect(cardCreator).toHaveLength(1);
});