declare namespace App {
  export type Card = {
    id: string;
    title: string;
    uid: string;
    text: string;
    createdAt: firebase.default.firestore.Timestamp|null;
  }
  
  export type User = {
    id: string,
    name: string;
    picture?: string|null;
  }
  
  export type Friend = {
    id: string,
    uid1: string,
    uid2: string,
  }
}