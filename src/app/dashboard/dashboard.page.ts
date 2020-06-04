import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { AccountPopoverComponent } from './account-popover/account-popover.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit , OnDestroy{
  
  
  private title:string;
  accueil:boolean;
  compte:boolean;
  notifications:boolean;
  voitures:boolean;
  passer_commande:boolean;
  mes_commandes:boolean;
  gerer_colis:boolean;
  gerer_utilisateurs:boolean;
  mes_courses:boolean;
  scanner:boolean;
  suivi_courses:boolean;
  private subscriptionUser:Subscription;
  role:string;
  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
              public popoverController: PopoverController,
              private usersService:UsersService) { }

  ngOnInit() {
    // this.accueil=true;
    // this.compte=this.notifications=this.voitures=this.ambulances=this.askForEmergency=this.hospitals=false;
    this.title=this.activatedRoute.snapshot.paramMap.get('id');
    this.subscriptionUser=this.usersService.userOb.subscribe((data)=>{
      //console.log(data)
      if(data!==null){
        this.role=data.role;
      }
    });
  }
  ionViewWillEnter(){
    const path = window.location.pathname.split('dashboard/')[1];
    if (path !== undefined) 
    {
      if(path==="Accueil")
      {
        this.accueil=true;
        this.compte=this.notifications=this.voitures=this.gerer_utilisateurs
        =this.gerer_colis=this.passer_commande=this.suivi_courses=this.scanner
        =this.mes_commandes=this.mes_courses=false;
      }else if(path==="Notifications")
      {
        this.notifications=true;
        this.compte=this.accueil=this.voitures=this.gerer_utilisateurs
        =this.gerer_colis=this.passer_commande=this.suivi_courses=this.scanner
        =this.mes_commandes=this.mes_courses=false;      
      }
      else if(path==="Compte")
      {
        this.compte=true;
        this.notifications=this.accueil=this.voitures=this.gerer_utilisateurs
        =this.gerer_colis=this.passer_commande=this.suivi_courses=this.scanner
        =this.mes_commandes=this.mes_courses=false;        
      }
      else if(path==="Commande")
      {
        this.passer_commande=true;
        this.notifications=this.accueil=this.voitures=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.suivi_courses=this.scanner
        =this.mes_commandes=this.mes_courses=false;      
      }
      else if(path==="Commandes")
      {
        this.mes_commandes=true;
        this.notifications=this.accueil=this.voitures=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.suivi_courses=this.scanner
        =this.passer_commande=this.mes_courses=false;   
      }
      else if(path==="Voitures")
      {
        this.voitures=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.suivi_courses=this.scanner
        =this.passer_commande=this.mes_courses=false;   
      }
      else if(path==="Scanner")
      {
        this.scanner=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.suivi_courses=this.voitures
        =this.passer_commande=this.mes_courses=false; 
      }
      else if(path==="Courses")
      {
        this.mes_courses=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.suivi_courses=this.voitures
        =this.passer_commande=this.scanner=false;
      }
      else if(path==="Suivi")
      {
        this.suivi_courses=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_utilisateurs
        =this.gerer_colis=this.compte=this.mes_courses=this.voitures
        =this.passer_commande=this.scanner=false;
      }
      else if(path==="Gestion")
      {
        this.gerer_colis=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_utilisateurs
        =this.suivi_courses=this.compte=this.mes_courses=this.voitures
        =this.passer_commande=this.scanner=false;
      }
      else if(path==="Utilisateurs")
      {
        this.gerer_utilisateurs=true;
        this.notifications=this.accueil=this.mes_commandes=this.gerer_colis
        =this.suivi_courses=this.compte=this.mes_courses=this.voitures
        =this.passer_commande=this.scanner=false;
      }
    }
  }
  async presentPopoverAccount(ev: any) {
    const popover = await this.popoverController.create({
      component: AccountPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  
  ngOnDestroy(): void {
    if(this.subscriptionUser)
    this.subscriptionUser.unsubscribe();
  }

}
