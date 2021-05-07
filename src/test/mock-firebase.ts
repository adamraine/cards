import * as firebaseMock from 'firebase-mock';
import firebase from 'firebase/app';

const mockAuth = new firebaseMock.MockAuthentication();
const mockFirestore = new firebaseMock.MockFirestore();
const mockStorage = new firebaseMock.MockStorage();
const mockSDK = firebaseMock.MockFirebaseSdk(
  // RTDB
  () => {
    return null;
  },
  // AUTHENTICATION
  () => {
    return mockAuth;
  },
  // FIRESTORE
  () => {
    return mockFirestore;
  },
  // STORAGE
  () => {
    return mockStorage;
  },
  // MESSAGING
  () => {
    return null;
  }
);

Object.assign(firebase, mockSDK);

export {
  mockAuth,
  mockFirestore,
  mockStorage,
  mockSDK,
};