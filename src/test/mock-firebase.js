import * as firebaseMock from 'firebase-mock';

const mockAuth = new firebaseMock.MockAuthentication();
const mockFirestore = new firebaseMock.MockFirestore();
const mockStorage = new firebaseMock.MockStorage();
const mockSDK = new firebaseMock.MockFirebaseSdk(
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

Object.assign(require('firebase/app'), mockSDK);

export {
  mockAuth,
  mockFirestore,
  mockStorage,
  mockSDK,
};