import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsVehiclePageRoutingModule } from './details-vehicle-routing.module';

import { DetailsVehiclePage } from './details-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsVehiclePageRoutingModule
  ],
  declarations: [DetailsVehiclePage]
})
export class DetailsVehiclePageModule {}
