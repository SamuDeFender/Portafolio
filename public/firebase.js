// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSjhbhil2v2xe6BKBRYFaxGBwxwjyl3qU",
  authDomain: "ingsamuelortega-8c663.firebaseapp.com",
  projectId: "ingsamuelortega-8c663",
  storageBucket: "ingsamuelortega-8c663.appspot.com",
  messagingSenderId: "556512021338",
  appId: "1:556512021338:web:905e65a65fe7f46752c163",
  measurementId: "G-78RSVHG9FC",
  storageBucket: 'gs://ingsamuelortega-8c663.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const st = getStorage(app)

document.addEventListener('DOMContentLoaded', function() {
    const loadEl = document.querySelector('#load');
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


    try {
      // let app = firebase.app();
      let features = [
        'auth', 
        'database', 
        'firestore',
        'functions',
        'messaging', 
        'storage', 
        'analytics', 
        'remoteConfig',
        'performance',
      ].filter(feature => typeof app[feature] === 'function');
      loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;

        // var listRef = storageRef.child('files/uid');

        // // Find all the prefixes and items.
        // listRef.listAll()
        //   .then((res) => {
        //     res.prefixes.forEach((folderRef) => {
        //       // All the prefixes under listRef.
        //       // You may call listAll() recursively on them.
        //     });
        //     res.items.forEach((itemRef) => {
        //       // All the items under listRef.
        //     });
        //   }).catch((error) => {
        //     // Uh-oh, an error occurred!
        //   });


      } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
      }
    });


