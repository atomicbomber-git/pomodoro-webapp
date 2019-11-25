/* Style related imports */
import "../css/app.scss"

/* Sound files */
import Vue from 'vue'
import Index from "./vue-components/Index"

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAkGu5acoJVMnYuFtUsUlVhati07rP9CGc",
    authDomain: "pomodoro-f7e3a.firebaseapp.com",
    databaseURL: "https://pomodoro-f7e3a.firebaseio.com",
    projectId: "pomodoro-f7e3a",
    storageBucket: "pomodoro-f7e3a.appspot.com",
    messagingSenderId: "182294179496",
    appId: "1:182294179496:web:a3c51953995400035a9c9d",
    measurementId: "G-DLWMZWFS0B"
};

firebase.initializeApp(firebaseConfig);

new Vue({
    el: "#app",
    render: h => h(Index)
})