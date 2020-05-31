import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private behaviorSubject:BehaviorSubject<{
    login:boolean,
    register:boolean
  }>;
  public obs:Observable<{
    login:boolean,
    register:boolean
  }>
  constructor() { 
    this.behaviorSubject=new BehaviorSubject({login:true,register:false});
    this.obs=this.behaviorSubject.asObservable();
  }

  displayLogin(){
    this.behaviorSubject.next({login:true,register:false});
  }
  displayRegister(){
    this.behaviorSubject.next({login:false,register:true});
  }
}
