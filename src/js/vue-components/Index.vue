<template>
    <div class="container">
        <div class="card mt-5">
            <div class="card-body">
                <h1> Awesome Pomodoro App </h1>

                <template v-show="currentUser">
                    <div class="alert alert-info">
                        Welcome, {{ currentUser.displayName }}
                    </div>
                </template>

                <template v-show="!currentUser">
                    <div class="alert alert-warning">
                        <i class="fa fa-warning"></i>
                        You haven't signed in yet. Click the sign in / sign up button in order to sign in if you have already registered your account, to sign up if you haven't.
                    </div>

                    <button 
                        @click="attemptSignIn"
                        class="btn btn-dark"
                        >
                        Sign In using Google
                        <i class="fa fa-google"></i>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

import * as firebase from "firebase/app";


export default {
    mounted() {
        // this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();

        

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user
                this.authStatus = true
                return
            }
            else {
                this.authStatus = false
            }
        });

        
        // firebase.auth().signInWithPopup(provider).then(function(result) {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     var token = result.credential.accessToken;
        //     // The signed-in user info.
        //     var user = result.user;
        //     // ...
        // })
        // .catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //     // The email of the user's account used.
        //     var email = error.email;
        //     // The firebase.auth.AuthCredential type that was used.
        //     var credential = error.credential;
        //     // ...
        // });
    },

    data() {
        return {
            authStatus: null,
            currentUser: null,
        }
    },

    methods: {
        attemptSignIn() {
            firebase.auth()
                .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return firebase.auth().signInWithPopup(this.googleAuthProvider)
                })
                .then(result => {
                    this.currentUser = result.user
                })
                .catch(error => {
                    console.log(error)
                    alert("INVALID SIGN IN")
                })
        },
    }
}
</script>

<style>

</style>