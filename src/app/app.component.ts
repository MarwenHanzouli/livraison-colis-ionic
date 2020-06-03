import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from './models/User.model';
import { UsersService } from './services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{
  

  private userSubscription:Subscription;
  private user:User;
  private disabled:boolean;
  private selectedIndex=0;

  private menu:any[]=[];
  private menuClient:any[];
  private menuLivreur:any[]; 
  private menuMagasinier:any[];  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private usersService:UsersService,
    private router:Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  async ngOnInit(){
    let x=await Storage.get({ key: "USER" });
    if(x.value && x.value!=="undefined")
    {
      this.usersService.next(JSON.parse(x.value));
    }
    else{
      this.usersService.next(null);
    }
      this.userSubscription=this.usersService.userOb.subscribe((data)=>{
        if(data && data!=="undefined")
        {
          this.disabled=false;
          this.user=data;
          const path = window.location.pathname.split('dashboard/')[1];
          if (path !== undefined) 
          {
            this.selectedIndex = this.menu.findIndex(page => page.id.toLowerCase() === path.toLowerCase());
            this.preparerMenu(path);
          }
          else{
            this.preparerMenu('Accueil');
          }
          
        }
        else{
          this.disabled=true; 
        }
      });
    this.router.events.pipe(filter(e=> e instanceof NavigationEnd)).subscribe(e=>{
      const path = window.location.pathname.split('dashboard/')[1];
      if (path !== undefined) 
      {
        this.selectedIndex = this.menu.findIndex(page => page.id.toLowerCase() === path.toLowerCase());
      }
    });
  }
  ngOnDestroy(): void {
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
  }
  acitve(){
    const path = window.location.pathname.split('dashboard/')[1];
    if (path !== undefined) 
    {
      this.selectedIndex = this.menu.findIndex(page => page.id.toLowerCase() === path.toLowerCase());
    }
  }
  preparerMenu(url:string){
    this.menu=[
      {
        id:'Accueil',
        title: 'Accueil',
        url: '/dashboard/Accueil',
        icon: 'home'
      },
      {
        id:'Compte',
        title: 'Mon compte',
        url: '/dashboard/Compte',
        icon: 'person-circle'
      },
      {
        id:'Notifications',
        title: 'Notifications',
        url: '/dashboard/Notifications',
        icon: 'notifications'
      }
    ];
    this.menuClient=[
      {
        id:'Commande',
        title: 'Passer une commande',
        url: '/dashboard/Commande',
        icon: 'wallet'
      },
      {
        id:'Commandes',
        title: 'Mes commandes',
        url: '/dashboard/Commandes',
        icon: 'reorder-four'
      }
    ];
    this.menuLivreur=[
      {
        id:'Courses',
        title: 'Mes courses',
        url: '/dashboard/Courses',
        icon: 'layers'
      },
      {
        id:'Scanner',
        title: 'Scanne colis',
        url: '/dashboard/Scanner',
        icon: 'qr-code'
      },
      {
        id:'Voitures',
        title: 'Mes voitures',
        url: '/dashboard/Voitures',
        icon: 'car'
      }
    ];
    this.menuMagasinier=[
      {
        id:'Gestion',
        title: 'Gérer les colis',
        url: '/dashboard/Gestion',
        icon: 'build'
      },
      {
        id:'Courses',
        title: 'Suivi les courses',
        url: '/dashboard/Courses',
        icon: 'list'
      },
      {
        id:'Scanner',
        title: 'Scanne colis',
        url: '/dashboard/Scanner',
        icon: 'qr-code'
      }
    ];
    if(this.user.role==="Client")
    {
      this.menu=this.menu.concat(this.menuClient);
    }
    else if(this.user.role==="Livreur")
    {
      this.menu=this.menu.concat(this.menuLivreur);
    }
    else if(this.user.role==="Magasinier")
    {
      this.menu=this.menu.concat(this.menuMagasinier);
    }
    else if(this.user.role==="Adminstrateur")
    {
      this.menu=this.menu.concat(this.menuMagasinier);
    }
    this.router.navigate(['/dashboard',url]);
  }
}
