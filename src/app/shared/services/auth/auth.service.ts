import { Injectable, NgZone } from '@angular/core';
import fireapp from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { NotifierService } from 'angular-notifier';
import { map, switchMap } from 'rxjs/operators';
import { Token } from '@angular/compiler';
import { FirebaseApp } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  verificationSent = false
  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private notifier: NotifierService
  ) { }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true
    }
    return false
  }
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
  


  userData(): User {
    return JSON.parse(localStorage.getItem('user')!)
  }
  // Sign in with email/password
  async signIn(email: string, password: string): Promise<void> {


    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('user', JSON.stringify(result.user));
      console.log(result.user)
      this.setUserData(result.user);
      console.log(result.user?.emailVerified)
      if (result.user?.emailVerified == false) {
        this.notifier.notify('error', 'Completar el proceso de verificación')
        return
      }
      if (result.user?.emailVerified === true) {
        setTimeout(() => {
          this.notifier.notify('success', 'Acceso realizado')
          document.getElementById('modalCloseLogin')?.click()
        }, 200);
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 1000);
      }
    } catch (error) {
      throwError(error);
      this.notifier.notify('error', 'El account no existe');
    }
  }

  signOut() {
    this.fireAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }



  // Sign in with Facebook
  // Auth logic to run auth providers
  async loginWithFB(): Promise<any> {
    try {
      const result = await this.fireAuth.signInWithPopup(new fireapp.auth.FacebookAuthProvider());
      console.log(result);
    } catch (err) {
      console.log(err.message);
    }
  }

  //GOOGLE
  async googleAuth(): Promise<any> {
    try {
      const result = await this.fireAuth.signInWithPopup(new fireapp.auth.GoogleAuthProvider());
      localStorage.setItem('user', JSON.stringify(result.user));
      this.setUserData(result.user);
    } catch (error) {
      throwError(error);
    }
  }

  // Sign up with email/password
  signUp(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result.user)
        this.sendVerification()
        document.getElementById('modalCloseRegister')?.click()
        setTimeout(() => {
          document.getElementById('hiddenButton')?.click()
        }, 1000);
      }).catch((error) => {
        console.log(error.message)
        this.notifier.notify('error', 'Ya existe un usuario con esta dirección de correo');
        return
      })
  }



  async sendVerification(): Promise<void> {
    return await (await this.fireAuth.currentUser)?.sendEmailVerification()
  }



}



