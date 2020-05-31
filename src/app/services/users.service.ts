import { Injectable, NgZone } from '@angular/core';
import { AbstractHttpService } from '../AbstractHttpService';
import { User } from '../models/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class UsersService extends AbstractHttpService{

  apiUrl=this.url;
  constructor(private httpClient:HttpClient,
              public afStore: AngularFirestore,
              public ngFireAuth: AngularFireAuth,
              public router: Router,  
              public ngZone: NgZone
            ) { 
    super();
  }
  register(user:User){
    return this.httpClient.post<Observable<any>>(`${this.apiUrl}users/add`,user);
  }
  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification();
  }
  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
  }
  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }
}
