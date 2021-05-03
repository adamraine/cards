import {render, screen} from '@testing-library/react';
import {mockFirestore} from './mock-firebase';
import {Card} from '../components/Card';

jest.mock('firebase/app');

/** @type {firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>} */
let mockDoc;

beforeEach(() => {
  mockDoc = {
    delete: jest.fn(),
  }
  mockFirestore.collection = jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue(mockDoc),
  });
});

it('handles delete button push', async () => {
  render(<Card data={{text: 'TEXT', id: 'ID'}}/>);
  const deleteButton = screen.queryByText('Delete');
  expect(deleteButton).toBeInTheDocument();

  deleteButton.click();
  expect(mockDoc.delete).toHaveBeenCalled();
});