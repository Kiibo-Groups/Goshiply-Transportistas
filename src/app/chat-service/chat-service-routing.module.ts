import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatServicePage } from './chat-service.page';

const routes: Routes = [
  {
    path: '',
    component: ChatServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatServicePageRoutingModule {}
