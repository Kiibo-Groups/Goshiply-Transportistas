
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatServicePageRoutingModule } from './chat-service-routing.module';

import { ChatServicePage } from './chat-service.page'; 
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    ChatServicePageRoutingModule
  ],
  declarations: [ChatServicePage]
})
export class ChatServicePageModule {}
