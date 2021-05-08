import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const deleteImage = functions.firestore.document('cards/{docId}')
  .onDelete(async (snap) => {
    const id = snap.id;
    const uid:string = snap.data().uid;
    await admin.storage().bucket().file(`images/${uid}/${id}`).delete();
  });
