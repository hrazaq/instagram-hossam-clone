import firebase from "firebase";

const firebaseApp = firebase.initializeApp({ 
    apiKey: "AIzaSyDU-hd0UPZ56xVbRzEUqLSZnqlW5RkudqA",
    authDomain: "hossam-instagram-clone.firebaseapp.com",
    databaseURL: "https://hossam-instagram-clone.firebaseio.com",
    projectId: "hossam-instagram-clone",
    storageBucket: "hossam-instagram-clone.appspot.com",
    messagingSenderId: "1026066867637",
    appId: "1:1026066867637:web:713043a1a404776103a5fc",
    measurementId: "G-N7LN41SHDT"
});

const db = firebaseApp.firestore(); // for db 
const auth = firebase.auth(); // for authentication
const storage = firebase.storage() // for saving files(images)

export  { db, auth, storage };