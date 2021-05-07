import * as React from 'react';
import {act} from '@testing-library/react';
import {shallow, ShallowWrapper} from 'enzyme';
import {mockFirestore, mockStorage} from './mock-firebase';
import {Card} from '../components/Card';

jest.mock('firebase/app');

let mockDoc: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>;
let mockStorageRef: firebase.default.storage.Reference;
let mockChild: firebase.default.storage.Reference;

beforeEach(() => {
  mockDoc = {
    delete: jest.fn(),
  };
  mockChild = {
    getDownloadURL: jest.fn().mockReturnValue(Promise.resolve('URL')),
    delete: jest.fn(),
  };
  mockStorageRef = {
    child: jest.fn().mockReturnValue(mockChild),
  };
  mockFirestore.collection = jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue(mockDoc),
  });
  mockStorage.ref = jest.fn().mockReturnValue(mockStorageRef);
});

it('renders properly', async () => {
  const card = shallow(<Card data={{text: 'TEXT', id: 'ID', uid: 'UID'}}/>);

  expect(mockStorageRef.child).toHaveBeenCalledWith('images/UID/ID');
  await Promise.resolve();
  expect(card.state('url')).toEqual('URL');
});

it('handles delete button push', async () => {
  const card = shallow(<Card data={{text: 'TEXT', id: 'ID', uid: 'UID'}}/>);
  const deleteButton = card.find('button');

  act(() => {
    deleteButton.simulate('click');
  });

  await Promise.resolve();

  expect(mockDoc.delete).toHaveBeenCalled();
  expect(mockChild.delete).toHaveBeenCalled();
});