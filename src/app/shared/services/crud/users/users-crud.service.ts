import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Feedback } from 'src/app/shared/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class UsersCrudService {

  constructor(private fireStore: AngularFirestore) { }

  readAllUsers(){
    return this.fireStore.collection('users').get()
  }

readUser(){
  
}

  del(userID: string){
    return this.fireStore.collection('users').doc(userID).delete()
}


updateUser(userID:string, data:any){
  console.log("Form data: ",data)
  return this.fireStore.collection('users').doc(userID).set(data)
}

sendFeedback(userID:string, data: Feedback) {
  return this.fireStore.collection('users').doc(userID).collection('feedbacks').add(data)
  
}

}
