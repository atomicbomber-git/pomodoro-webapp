<template>
    <div class="container">
        <div class="card mt-5">
            <div class="card-body">
                <h1> Awesome Pomodoro App </h1>

                <template v-if="firstTimeAuth">
                    <div class="alert alert-info">
                        <i class="fa fa-spinner"></i>
                        Attempting to authenticate. Please wait.
                    </div>
                </template>

                <template v-if="!firstTimeAuth && currentUser">
                    <div class="alert alert-info">
                        Welcome, <strong> {{ currentUser.displayName }} </strong>
                    </div>
                </template>

                <template v-if="!firstTimeAuth && !currentUser">
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

        <div 
            v-if="currentPomodoroSession"
            class="card mt-3"
            >
            <div class="card-body">
                <h2>
                    Your Session
                </h2>
            
                <div class="progress">
                    <div 
                        class="progress-bar"
                        role="progressbar"
                        :style="{
                            width: `${elapsed_percentage}%`,
                        }"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        >
                    </div>
                </div>

                <h1>
                    {{ timer_display }}
                </h1>

                <div class="text-right mt-2">
                    <button 
                        @click="currentPomodoroSession.running = false"
                        v-if="currentPomodoroSession.running"
                        class="btn btn-danger btn-sm">
                        Pause
                        <i class="fa fa-pause"></i>
                    </button>

                    <button 
                        @click="onPlayButtonClick"
                        v-else
                        class="btn btn-success btn-sm">
                        Start / Continue
                        <i class="fa fa-play"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import * as firebase from "firebase/app";
import "firebase/firestore"
import moment from "moment"

export default {
    mounted() {
        this.initializeAuth()
    },

    data() {
        return {
            firstTimeAuth: true,
            authStatus: null,
            currentUser: null,
            currentPomodoroSessionId: null,
            currentPomodoroSession: null,

            pomodoroTimer: 0,
            maxPomodoroLength: 25 * 60,
        
            timeoutHandler: null,
        }
    },

    computed: {
        timer_display() {
            return moment()
                .hour(0)
                .minute(0)
                .second(
                    this.currentPomodoroSession.length_seconds - 
                    this.currentPomodoroSession.elapsed_seconds
                )
                .format('mm : ss')
        },

        elapsed_percentage() {
            return this.currentPomodoroSession.elapsed_seconds /
                this.currentPomodoroSession.length_seconds * 
                100
        }
    },

    methods: {
        moment,

        initializeDatabase() {
            this.db = firebase.firestore()

            let data = {
                uid: this.currentUser.uid,
                elapsed_seconds: 0,
                length_seconds: 60 * 25,
                started_at: new Date(),
                type: 'current',
                running: false,
            }

            this.db.collection('pomodoro_sessions')
                .where('uid', '==', this.currentUser.uid)
                .where('type', '==', 'current')
                .limit(1)
                .get()
                .then(snapshot => {

                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            this.currentPomodoroSessionId = doc.id
                            this.currentPomodoroSession = doc.data()
                        })
                    }

                    this.db.collection('pomodoro_sessions').add(data)
                        .then(ref => {
                            console.log(ref)
                        })
                })
        },

        initializeAuth() {
            this.googleAuthProvider = new firebase.auth.GoogleAuthProvider()

            firebase.auth().onAuthStateChanged(user => {
                if (this.firstTimeAuth) {
                    this.firstTimeAuth = false
                }

                if (user) {
                    this.currentUser = user
                    this.authStatus = true

                    this.initializeDatabase()
                    return
                }
            })
        },

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
                    console.info(error)
                })
        },

        onPlayButtonClick() {
            this.currentPomodoroSession.running = true

            this.setIncrementTimeout()
        },

        setIncrementTimeout() {
            this.timeoutHandler = window.setTimeout(this.incrementElapsed, 1000)
        },

        incrementElapsed()
        {
            this.currentPomodoroSession.elapsed_seconds += 1
            window.clearTimeout(this.timeoutHandler)

            if (this.currentPomodoroSession.running) {
                this.setIncrementTimeout()
            }

            this.syncSessionData()
        },

        syncSessionData() {
            this.db
                .collection('pomodoro_sessions')
                .doc(this.currentPomodoroSessionId)
                .set(this.currentPomodoroSession)
        },
    }
}
</script>