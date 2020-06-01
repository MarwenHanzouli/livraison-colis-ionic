import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { AccountPopoverComponent } from './account-popover/account-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  entryComponents:[
    AccountPopoverComponent
  ],
  declarations: [
    DashboardPage,
    AccountPopoverComponent
  ]
})
export class DashboardPageModule {}
