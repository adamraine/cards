import * as React from 'react';
import {act} from '@testing-library/react';
import {mockAuth, mockFirestore, mockStorage} from './mock-firebase';
import {shallow, mount} from 'enzyme';
import {CardCreator} from '../components/CardCreator';

jest.useFakeTimers();
jest.mock('firebase/app');
jest.mock('react-firebase-hooks/firestore');

let mockCollection: firebase.default.firestore.CollectionReference<firebase.default.firestore.DocumentData>;
let mockDock: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>;
let mockStorageRef: firebase.default.storage.Reference;
let mockChild: firebase.default.storage.Reference;

beforeEach(() => {
  mockAuth.currentUser = {
    uid: 'USERID',
  };

  mockDock = {
    id: 'DOCID',
    set: jest.fn(),
  };
  mockCollection = {
    doc: jest.fn().mockReturnValue(mockDock),
  };
  mockFirestore.collection = jest.fn().mockReturnValue(mockCollection);

  mockChild = {
    put: jest.fn(),
  };
  mockStorageRef = {
    child: jest.fn().mockReturnValue(mockChild),
  };
  mockStorage.ref = jest.fn().mockReturnValue(mockStorageRef);
});

it('updates text state on change', () => {
  const cardCreator = shallow(<CardCreator/>);
  const input = cardCreator.find('input[type="text"]');

  act(() => {
    input.simulate('change', {target: {value: 'NEWVALUE'}});
  });

  expect(cardCreator.state('text')).toEqual('NEWVALUE');
});

it('updates image state on change', () => {
  const cardCreator = shallow(<CardCreator/>);
  const input = cardCreator.find('input[type="file"]');

  act(() => {
    input.simulate('change', {target: {files: ['NEWVALUE']}});
  });

  expect(cardCreator.state('image')).toEqual('NEWVALUE');
});

it('adds new card when button clicked', async () => {
  const cardCreator = mount(<CardCreator/>);

  const createCardButton = cardCreator.find('button[type="submit"]');
  const textInput = cardCreator.find('input[type="text"]');
  const imageInput = cardCreator.find('input[type="file"]');

  act(() => {
    textInput.simulate('change', {target: {value: 'FORMVALUE'}});
    imageInput.simulate('change', {target: {files: ['IMAGEVALUE']}});
  });

  act(() => {
    createCardButton.simulate('submit', {preventDefault: jest.fn()});
  });

  await Promise.resolve();

  expect(mockCollection.doc).toHaveBeenCalled();
  expect(mockDock.set).toHaveBeenCalledWith({
    text: 'FORMVALUE',
    createdAt: {type: 'serverTimestamp'},
    uid: 'USERID',
  });

  expect(mockStorageRef.child).toHaveBeenCalledWith('images/USERID/DOCID');
  expect(mockChild.put).toHaveBeenCalledWith('IMAGEVALUE');
});
