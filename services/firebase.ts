import * as Firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: 'AIzaSyBiHtB9MQI1F4RnXVq6HpwoKwGXj5rr3PM',
    authDomain: 'reactnative-e8d6a.firebaseio.com',
    databaseURL: 'reactnative-e8d6a.firebaseio.com',
    projectId: 'reactnative-e8d6a',
    storageBucket: 'reactnative-e8d6a.appspot.com',
    messagingSenderId: '841400343135'
};

const app = Firebase.initializeApp(config);

export const firestore = app.firestore();
export const storage = app.storage();