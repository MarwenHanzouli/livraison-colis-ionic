import { Component, OnInit, ElementRef } from '@angular/core';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  private login:boolean;
  private register:boolean;

  constructor(private homeService:HomeService,
              private el:ElementRef) {}

  segmentChanged(event){
    if(event.detail.value==="signup")
    {
      this.login=false;
      this.register=true;
    }else if(event.detail.value==="signin"){
      this.login=true;
      this.register=false;
    }
  }

  ngOnInit(): void {
    this.homeService.obs.subscribe((data)=>{
      this.login=data.login;
      this.register=data.register;
      if(this.login===true){
        this.el.nativeElement.querySelector('ion-segment').setAttribute('value','signin')
      }
    })
  }
}
