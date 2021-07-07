import { Injectable } from '@angular/core';
import fireapp from 'firebase/app';
import { AngularFireAuth} from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private fireStore: AngularFirestore, private fireAuth: AngularFireAuth, private router: Router
  ) { }
  setUserData(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }
    return this.fireStore.doc(`users/${user.uid}`).set(userData, {
      merge: true
    })
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true
    }
    return false
  }

  userData(): User {
    return JSON.parse(localStorage.getItem('user')!)
  }

  signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    })
  }

 // Sign in with Facebook

 
  // Auth logic to run auth providers
  loginWithFB(): Promise<any>{
    return this.fireAuth.signInWithPopup( new fireapp.auth.FacebookAuthProvider())
      .then((result) => {
        console.log(result);
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  //GOOGLE
  googleAuth(): Promise<any> {
    return this.fireAuth.signInWithPopup(new fireapp.auth.GoogleAuthProvider())
      .then((result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.setUserData(result.user);
      }).catch((error) => {
        throwError(error)
      })

  }



}