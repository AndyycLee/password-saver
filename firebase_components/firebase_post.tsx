import { getFirestore, initializeFirestore } from "firebase/firestore"

import { app } from "../firebase"

// Get a Firestore instance const db = firebase.firestore()

const db = getFirestore(app) // old code, why does it not work anymore?
// const db = getFirestore(app, "leetcoderv3-daef7") // for some reason i need to use the firestore id
// const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
  
// })
//exort the db, and then import in popup.tsx, i think next
//step is to create a new collection in firebase just like thingsRef = db.collection('things');

// import { collection, addDoc } from "firebase/firestore";

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// } https://www.youtube.com/watch?v=YPgb7g8is2w
//it works! now on submit i need to take data from the payload from leetcode and store it in the db, later i can build a ui to display the data
// let timestamp = serverTimestamp()
//export const db = getFirestore(app);

export { db }
