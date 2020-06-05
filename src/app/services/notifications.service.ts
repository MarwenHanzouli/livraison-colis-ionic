import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private firestore:AngularFirestore) { }

  public getAllNotifications(){
    return this.firestore.collection('notifications').valueChanges();
  }
}
