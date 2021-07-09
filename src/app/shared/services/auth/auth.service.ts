import { Injectable, NgZone } from '@angular/core';
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
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
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

  actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'plataforma-asociaciones-clm.vercel.app',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
  };

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

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      const result = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */
      this.sendVerificationMail(email);
      this.setUserData(result.user);
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail(email:string) {
    return this.fireAuth.sendSignInLinkToEmail(email, this.actionCodeSettings)
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail: string) {
    return this.fireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

}