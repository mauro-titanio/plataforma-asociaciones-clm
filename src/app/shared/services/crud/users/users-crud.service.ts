import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersCrudService {

  constructor(private fireStore: AngularFirestore) { }

  readAllUsers(){
    return this.fireStore.collection('users').get()
  }









}
