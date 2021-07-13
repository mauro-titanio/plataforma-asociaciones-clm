import { Injectable, NgZone } from '@angular/core';
import fireapp from 'firebase/app';
import { AngularFireAuth} from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private notifier: NotifierService
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

  async signOut() {
    await this.fireAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

 // Sign in with Facebook

 
  // Auth logic to run auth providers
  async loginWithFB(): Promise<any>{
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

  // Sign in with email/password
  async signIn(email: string, password: string):Promise<void> {
    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(email, password);
      this.ngZone.run(() => {
        this.notifier.notify('success', 'Acceso realizado'); 
      });
      this.setUserData(result.user);
      setTimeout(() => {
        document.getElementById('modalCloseLogin')?.click()
        this.router.navigate(['/home'])
      }, 200); 
    } catch (error) {
      this.notifier.notify('error', 'Ha occurrido un error');
    }
  }

  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      const result = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      this.sendVerification();
      this.notifier.notify('success', 'Te hemos enviado un correo de verificación');
      document.getElementById('modalCloseRegister')?.click();
      this.router.navigate(['/verification-email']);
      console.log(result.user);
    } catch (error) {
      this.notifier.notify('error', 'El usuario ya existe');
    }
  }

async sendVerification(): Promise<void>{
  return await (await this.fireAuth.currentUser)?.sendEmailVerification()
}


 
}