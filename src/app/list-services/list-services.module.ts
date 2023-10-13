import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListServicesPageRoutingModule } from './list-services-routing.module';

import { ListServicesPage } from './list-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListServicesPageRoutingModule
  ],
  declarations: [ListServicesPage]
})
export class ListServicesPageModule {}
