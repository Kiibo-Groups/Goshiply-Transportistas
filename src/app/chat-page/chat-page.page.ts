import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent, NavController, LoadingController } from '@ionic/angular';
import { EventsService } from '../service/events.service';
import { PusherServiceService } from '../service/pusher-service.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.page.html',
  styleUrls: ['./chat-page.page.scss'],
})
export class ChatPagePage implements OnInit {
 
  user:any;
  data:any;
  news_msgs:number = 0;
  channel: any;
  loading: any;
  chats_accept:number = 0;
  chats_norms:number = 0;
  tabId:string = 'InProgress';
  constructor(
    public server: ServerService,
    public loadingController: LoadingController,
    public nav:NavController,
    public pusher: PusherServiceService, 
    public events: EventsService,
    public statusBar: StatusBar
  ) { 
    this.events.subscribe('pusher_chat',(dat) => { // Nos subscribimos para los nuevos mensajes
      this.loadData();
    });
  }

  ngOnInit() {
    
  }

  async ionViewWillEnter(){
    this.loading = await this.loadingController.create({
      mode:"ios"
    });
    await this.loading.present();
    this.statusBar.backgroundColorByHexString("#2a7561");
    this.statusBar.styleLightContent(); 
    this.user = JSON.parse(localStorage.getItem('user_dat'));
    await this.loadData();
  }

  /**
   * Obtener listado de chats
   */
  async loadData()
  {
    this.server.getChats(localStorage.getItem('user_id')).subscribe((response:any) => {
      this.loading.dismiss();
      console.log(response);
      if (response.status) {
        this.data   = response.data;
        this.news_msgs = response.news_msgs;
        this.chats_accept = response.chats_accept;
        this.chats_norms = response.chats_norms;
         
        if (!this.channel) {
          // Nos conectamos
          if (this.user.id_pusher) {
            this.channel = this.pusher.init(this.user.id_pusher);
            this.pusher.SubscribeMsg(this.channel,'new-message');
          }else {
            // Mandamos hacer el id_puhser
            this.server.createIdPusher(localStorage.getItem('user_id')).subscribe((response:any) => {
              if (response.status == 'done') {
                this.channel = this.pusher.init(response.user.id_pusher);
                this.pusher.SubscribeMsg(this.channel,'new-message');          
              }
            });
          }
        }
      }
      
    });
  }

  /**
   * Cambio de vista 
   * @param eve 
   */
  tabChange(eve) {
    // console.log(eve.tab);
    this.tabId = eve;
  }

  /**
   * Retroceder
   */
  backButton() { 
    this.channel = this.pusher.end(this.user.id_pusher);
    this.nav.back();
  }


}
