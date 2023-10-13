import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListServicesPage } from './list-services.page';

const routes: Routes = [
  {
    path: '',
    component: ListServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListServicesPageRoutingModule {}
