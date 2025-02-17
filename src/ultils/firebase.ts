// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAgYHJaUFRkA7w_jhp8haNceBzYi9txPr0',
  authDomain: 'mealstogo-b034d.firebaseapp.com',
  projectId: 'mealstogo-b034d',
  storageBucket: 'mealstogo-b034d.appspot.com',
  messagingSenderId: '163319642755',
  appId: '1:163319642755:web:d2ed4c0cb0b91c571639b6',
  measurementId: 'G-JGXE5ZCLXW',
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy đối tượng Storage
const storage = getStorage(app);

export { storage };
