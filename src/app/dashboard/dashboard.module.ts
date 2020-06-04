import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { AccountPopoverComponent } from './account-popover/account-popover.component';
import { PasserCommandeComponent } from './passer-commande/passer-commande.component';
import { AccueilComponent } from './accueil/accueil.component';
import { GererColisComponent } from './gerer-colis/gerer-colis.component';
import { SuiviCoursesComponent } from './suivi-courses/suivi-courses.component';
import { ScannerComponent } from './scanner/scanner.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MesVoituresComponent } from './mes-voitures/mes-voitures.component';
import { MesCoursesComponent } from './mes-courses/mes-courses.component';
import { MesCommandesComponent } from './mes-commandes/mes-commandes.component';
import { GererUtilisateursComponent } from './gerer-utilisateurs/gerer-utilisateurs.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  entryComponents:[
    AccountPopoverComponent
  ],
  declarations: [
    PasserCommandeComponent,
    DashboardPage,
    AccueilComponent,
    GererColisComponent,
    AccountPopoverComponent,
    MesCommandesComponent,
    MesCoursesComponent,
    MesVoituresComponent,
    NotificationsComponent,
    ScannerComponent,
    SuiviCoursesComponent,
    GererUtilisateursComponent,
    MonCompteComponent
  ]
})
export class DashboardPageModule {}
