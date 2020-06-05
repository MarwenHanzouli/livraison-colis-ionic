import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  private data:any[]=[];
  firstLoadingEnd:boolean=false;
  
  constructor(private notificationsService:NotificationsService) {}
  ngOnInit(): void {
    this.notificationsService.getAllNotifications().subscribe((notifs)=>{
      this.data=notifs;
      this.firstLoadingEnd=true;
    })
    // for(let i=0;i<200;i++){
    //   this.data.push(i);
    // }
    
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.data.length == 1000) {
        event.target.disabled = true;
      }
    }, 3000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
