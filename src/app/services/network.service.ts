import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
const { Network } = Plugins;
var connected:boolean;
Network.getStatus().then(function(res){
  connected=res.connected;
});

@Injectable({
  providedIn: 'root'
})

export class NetworkService {

  private subject:BehaviorSubject<{connected:boolean}>=new BehaviorSubject({connected:connected});
  public obNetwork:Observable<{connected:boolean}>=this.subject.asObservable();
  
  constructor() { 
    let handler = Network.addListener('networkStatusChange', (status) => {
      console.log("Network status changed", status);
      this.subject.next({connected:status.connected})
    });
    // Network.getStatus().then((data)=>{
    //   this.subject=new BehaviorSubject({connected:data.connected})
    // })
  }
}
