import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsVehiclePage } from './details-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsVehiclePageRoutingModule {}
