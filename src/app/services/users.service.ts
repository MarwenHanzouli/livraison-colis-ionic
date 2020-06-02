import { Injectable, NgZone } from '@angular/core';
import { AbstractHttpService } from '../AbstractHttpService';
import { User } from '../models/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
var userSubject:BehaviorSubject<User>;
Storage.get({ key: "USER" }).then((data)=>{
  userSubject=new BehaviorSubject(JSON.parse(data.value));
});

@Injectable({
  providedIn: 'root'
})
export class UsersService extends AbstractHttpService{
  public userOb:Observable<any>;
  private USER_STORAGE: string ="USER";
  private u:any;
  apiUrl=this.url;
  constructor(private httpClient:HttpClient,
              public afStore: AngularFirestore,
              public ngFireAuth: AngularFireAuth,
              public router: Router,  
              public ngZone: NgZone
            ) {           
              super();
              this.userOb=userSubject.asObservable();
  }
  public next(us){
    userSubject.next(us);
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
  async logout(){ 
    return this.ngFireAuth.signOut().then(async () => {
      this.router.navigate(['/home']);
      await Storage.remove({key:this.USER_STORAGE});
      userSubject.next(null);
    });
  }
  
}
