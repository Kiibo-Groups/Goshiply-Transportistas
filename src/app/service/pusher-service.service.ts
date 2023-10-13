import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events} from '@ionic/angular';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherServiceService {

  channel;
  pusher;
  constructor(
    public http: HttpClient,
    public events: Events
  ) {
    this.pusher = new Pusher('20ffd91b6117e9324915', {
      cluster: 'us3',
    }); 
  }

  /**
   * Subscribe to channel
   * @param channel_subscribe 
   * @returns 
   */
  public init(channel_subscribe){
    this.channel = this.pusher.subscribe(channel_subscribe); 
    return this.channel;
  }

  public end(channel_subscribe){
    this.channel = this.pusher.unsubscribe(channel_subscribe); 
    return this.channel;
  }

  /**
   * Nos conectamos al canal para recibir actualizaciones
   * @param channel 
   * @param bind 
   */
  async SubscribeMsg(channel,bind)
  {
    channel.bind(bind, (data) => {
      // Recibimos nuevo mensaje
      this.events.publish('pusher_chat', bind);
      console.log(data); 
    });
  }
}
