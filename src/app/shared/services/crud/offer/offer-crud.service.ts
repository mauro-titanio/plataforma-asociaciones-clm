import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OfferCrudService {

  constructor(private fireStore: AngularFirestore) { }

  newOffer(userID:string, data: any) {
    return this.fireStore.collection('users').doc(userID).collection('offers').add(data)
  }
 
  readAllOffers(userID: string){
    return this.fireStore.collection('users').doc(userID).collection('offers').get()
  }
  
  getOffer(userID:string,offerID: string ){
    return this.fireStore.collection('users').doc(userID).collection('offers').doc(offerID).get()
  }
  
  updateOffer(userID:string, data:any,  offerID: string){
    return this.fireStore.collection('users').doc(userID).collection('offers').doc(offerID).set(data)
  }
  
  deleteOffer(userID:string, offerID:string){
    return this.fireStore.collection('users').doc(userID).collection('offers').doc(offerID).delete()
  }

}
