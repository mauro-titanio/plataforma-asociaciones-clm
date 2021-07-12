import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AssociationCrudService {

  constructor(private fireStore: AngularFirestore) { }


newAssociation(data: any, userID:string) {
  return this.fireStore.collection('users').doc(userID).collection('association').add(data)
  
}

readAllAssociation(userID: string){
  return this.fireStore.collection('users').doc(userID).collection('association').get()
}

getAssociation(userID:string,associationID: string ){
  return this.fireStore.collection('users').doc(userID).collection('association').doc(associationID).get()
}

updateAssociation(userID:string, data:any,  associationID: string){
  console.log(data)
  return this.fireStore.collection('users').doc(userID).collection('association').doc(associationID).set(data)
}

deleteAssociation(userID:string, associationID:string){
  return this.fireStore.collection('users').doc(userID).collection('association').doc(associationID).delete()
}







}