import { NavController, IonTextarea, Platform, ToastController, Events, LoadingController, ModalController, ActionSheetController } from '@ionic/angular';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { PusherServiceService } from '../service/pusher-service.service';
import { ServerService } from '../service/server.service';
import { DomSanitizer } from '@angular/platform-browser';  
 
@Component({
  selector: 'app-chat-service',
  templateUrl: './chat-service.page.html',
  styleUrls: ['./chat-service.page.scss'],
})
export class ChatServicePage implements OnInit {

  @ViewChild('messageContent', {static: false}) messageContent: ElementRef;
  @ViewChild('mCSB_1_container', {static: false}) mCSB_1_container: ElementRef;
  @ViewChild('message_Input',{static:false}) message_Input: IonTextarea;


  messages: any;
  user_id: any;
  user_to:any;
  user_to_id:any;
  service_id:any;
  service:any;
  user:any;
  messageInput: string;
  type_chat:number = 0;
  channel: any;
  loading: any;
  attachModal:boolean = false; 

  d:any; 
  h:any;
  m:any;
  i = 0;
  img_preview:any;
  cam_preview:any;
  vid_preview:any;
  archivo_up:any;

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audioList: any[] = [];
  minutes:any = 0;
  seconds:any = 0;
  timerAudio:any;

  writening:boolean = false;
  constructor(
    public nav: NavController,
    public server : ServerService,
    private platform: Platform,
    public statusBar: StatusBar,
    public pusher: PusherServiceService, 
    public route: ActivatedRoute,
    public renderer: Renderer2,
    public toastController: ToastController,
    public events: Events,
    private sanitizer: DomSanitizer,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {
    this.events.subscribe('pusher_chat',(dat) => { // Nos subscribimos para los nuevos mensajes
      this.getChats();
    });
  }

  async ngOnInit() {
    await this.chkUser();
  }

  /**
   * Validamos usuario
   */
  chkUser()
  {
    this.user_id = localStorage.getItem("user_id") ? localStorage.getItem("user_id") : 0;
    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response:any) => {
      if (response.status) { // Si exsite el usuario 
          this.user = response.data;
      }else {
        this.server.CloseSession();
        this.nav.navigateBack('/login')
      }
    });
  }

  /**
   * Validamos y cargamos chats
   */
  async ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#2a7561");
    this.statusBar.styleLightContent(); 

    this.message_Input.setFocus();
    this.message_Input.autoGrow = true;
    setTimeout(() => { 
      this.updateScrollbar(); 
      this.service_id = this.route.snapshot.paramMap.get('service');
      this.user_to_id = this.route.snapshot.paramMap.get('userTo');
      if (this.service_id) {
        this.getChats(); // Cargamos los chats 
      }else {
        this.nav.navigateRoot('/home');
      }
     }, 500);
  }

  /**
   * Cargamos Chats
   */
  getChats()
  {
    this.server.getServiceChat(this.user_id, this.user_to_id ,this.service_id).subscribe((data:any) => {
      console.log(data);
      this.user_to       = data.user;
      this.service    = data.service;
      this.messages   = data.chats; 
       
      if (this.service.id_pusher != null) {

        if (!this.channel) {
          // Nos conectamos
          this.channel = this.pusher.init(this.service.id_pusher);
          this.pusher.SubscribeMsg(this.channel,'new-message');
          console.log("Conectamos con pusher...");
        }
 
      }else {
        this.server.presentToast("El servicio no cuenta con un canal de comunicación","danger");
        this.nav.navigateRoot('/tabs/home');
      }
 
      setTimeout(() => {
        this.fakeMessage();
      }, 800);
    });
  }

  /**
   * Envio de Mensaje
   */
  insertMessage(sender = 1,msg = this.messageInput)
  {
    let data = {
      app_user_id : this.user_to.id,
      carrier_id  : this.user_id,
      services_id : this.service_id,
      type_chat   : 0, // 0 => solo texto
      msg         : msg,
      sender      : sender, // Envio de usuario 
      viewer      : 0,
      status      : 0,
      channel     : this.service.id_pusher,
      event       : 'new-message'
    };
 
    if (document.querySelector(".load-writen") !== null) {
      document.querySelector('.load-writen').remove();
    }
 
    this.server.sendChat(data).subscribe((req:any) => {
      if (req.status) { // Mensaje enviado...
        this.server.getChat(this.service_id,data.channel,data.event).subscribe((rex:any) => {
          this.message_Input.setFocus();
          this.message_Input.value = '';
        }); 
      }else {
        this.server.presentToast("Ha ocurrido un problema por favor, intente más tarde.","danger");
      }
    });
  }

  makeid() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
 
 
  fakeMessage() {
    if (this.messages.length > 0) {
      return false;
    } 
    // Creamos el Loading
    this.loadingCreate();

    
    if (this.service != null) {
      setTimeout(() => {
        
        if (document.querySelector('.message.message-personal.loading')) {
          document.querySelector('.message.message-personal.loading').remove();
        }
        
        // Registramos el msg
        let msg = "Hola "+this.user_to.name+" He aceptado tu solicitud del servicio #"+this.service.id+" Comentanos en que podemos ayudarte...";
        this.insertMessage(1,msg);

      }, 1000);
    } 
  }

  setNewMessage(data)
  {
    const div: HTMLDivElement = this.renderer.createElement('div');  
    const divTime: HTMLDivElement = this.renderer.createElement('div');
 
    div.className = "message message-personal new";  
    div.innerHTML = data.msg;
    
    divTime.className = "timestamp";
    divTime.innerHTML = this.setDate();
    this.renderer.appendChild(div,divTime);

    this.renderer.appendChild(this.mCSB_1_container.nativeElement,div);
  }
      
  writen(ev)
  {
    if (ev.detail.target.textLength > 0) { 
      if (!this.writening) {
        this.writening = true;   
      
        // Creamos el Loading
        const div: HTMLDivElement = this.renderer.createElement('div');
        const figure: HTMLElement = this.renderer.createElement('figure');
        const img: HTMLImageElement = this.renderer.createElement('img');
        const span: HTMLSpanElement = this.renderer.createElement('span');

        div.className = "message message-personal loading load-writen new";
        figure.className = "avatar";
        img.src = this.service.portada;
  
        this.renderer.appendChild(figure,img);
        this.renderer.appendChild(div, span);
        this.renderer.appendChild(div, figure);
        this.renderer.appendChild(this.mCSB_1_container.nativeElement,div);
      }
    }else {
      this.stopWriten();
    }
  }

  stopWriten()
  {
    
    if (document.querySelector(".load-writen") !== null) {
      document.querySelector('.load-writen').remove();
    }
    this.writening = false;
  }

  /**
   * Opciones
   * @param ev 
   */
  async OptionsChat() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cerrar trato con '+this.user_to.name,
          icon: 'create',
          handler: () => {
            this.AcceptService();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss(); 
  }

  async AcceptService()
  {
    const loading = await this.loadingController.create({
      message:'Cerrando servicio con '+this.user_to.name,
      mode:'ios'
    });
    await loading.present();

    // Creamos el Loading
    this.loadingCreate();
    
    setTimeout(() => {
       
      if (document.querySelector('.message.message-personal.loading')) {
        document.querySelector('.message.message-personal.loading').remove();
      }
      
      // Registramos el msg
      let msg = "Felicidades por aceptar el servicio!!";
      this.insertMessage(2,msg);

      this.server.AcceptService(this.service.id,this.user_to.id).subscribe((req:any) => {
        loading.dismiss();
        console.log(req);
        if (req.status == true) {
          this.server.presentToast('Servicio cerrado con éxito...',"success","middle");
          this.nav.navigateForward('/wallet');
        }
      });
    }, 1000);

    

  }

  /**
   * Loading Meesage Create
   */
  loadingCreate()
  {
    const div: HTMLDivElement = this.renderer.createElement('div');
    const figure: HTMLElement = this.renderer.createElement('figure');
    const img: HTMLImageElement = this.renderer.createElement('img');
    const span: HTMLSpanElement = this.renderer.createElement('span');

    div.className = "message message-personal loading new";
    figure.className = "avatar";
    img.src = this.service.portada;

    this.renderer.appendChild(figure,img);
    this.renderer.appendChild(div, span);
    this.renderer.appendChild(div, figure);
    this.renderer.appendChild(this.mCSB_1_container.nativeElement,div);
  }   

  /**
   * Actualizar Scroll
   */
  updateScrollbar() {
    this.messageContent.nativeElement.scrollTop = this.messageContent.nativeElement.scrollHeight;
  }

  backButton() { 
    this.nav.back();
  }

  setDate(){
   let d = new Date();
   let m = d.getMinutes();
   return 'hace' + d.getHours() + ':' + m; 
  }
 

}
