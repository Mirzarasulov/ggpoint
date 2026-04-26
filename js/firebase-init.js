// Firebase инициализация для GGPoint
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onValue, get, set, push, update, remove, query, orderByChild, equalTo, limitToLast } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDcyOWAF7TA8h8P36Sk5EbDPzA9sEFuTXo",
    authDomain: "ggpoint-shop.firebaseapp.com",
    databaseURL: "https://ggpoint-shop-default-rtdb.firebaseio.com",
    projectId: "ggpoint-shop",
    storageBucket: "ggpoint-shop.firebasestorage.app",
    messagingSenderId: "182227173652",
    appId: "1:182227173652:web:0949e2edae9900afd98201"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Экспорт для использования в других модулях
export { 
    database, 
    auth,
    ref, 
    onValue, 
    get, 
    set, 
    push, 
    update, 
    remove,
    query,
    orderByChild,
    equalTo,
    limitToLast,
    signInWithEmailAndPassword,
    onAuthStateChanged
};
