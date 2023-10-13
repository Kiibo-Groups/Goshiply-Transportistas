import { Component,Renderer2,Inject } from '@angular/core';
import { Platform,NavController,Events, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ServerService } from './service/server.service'; 

import OneSignal from 'onesignal-cordova-plugin';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  appType:number = 0;
  dir:string = "ltr";
  text:any;
  user:any = [];
  public appPages:any = [];

  geoLatitude = null;
  geoLongitude=null;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public nav : NavController,
    public menu: MenuController, 
    public events: Events, 
    public server: ServerService,
    public alertController: AlertController
  ) {
    // Inicializamos la app
    this.initializeApp();
    this.events.subscribe('user_data', (dat) => {
     this.user = dat;
    });
    // Obtenemos el usuario para registrarlo a las notificaciones push
    this.events.subscribe('user_login', (id) => {
      this.subPush(id);
    });

  }
  

  assginAppType(ty)
  {
    this.dir = ty == 0 ? "ltr" : "rtl";
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // this.server.lastLocation(localStorage.getItem('user_id')).then((data:any) => {
      //     localStorage.setItem("current_lat", data.coords.latitude);
      //     localStorage.setItem("current_lng", data.coords.longitude);
      //     // Registramos en el servidor primario
      //     var allData = {lat : data.coords.latitude ,lng : data.coords.longitude, user_id : localStorage.getItem('user_id')}
      //     console.log(allData);
      //     this.server.upLocation(allData).subscribe();
      // });

      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();

      this.splashScreen.hide();

      this.loadData();
      this.subPush();
      
      this.appPages = [
        {
          title: 'Inicio',
          url: '/home',
          icon: 'home-outline'
        },
        {
          title: "Mis Documentos",
          url: '/detail',
          icon: 'document-text'
        },
        {
          title: "Mi Vehiculo",
          url: '/details-vehicle',
          icon: 'construct-outline'
        },
        {
          title: "Mis Solicitudes",
          url: '/request-services',
          icon: 'list-outline'
        },
        {
          title: 'Mi Cuenta',
          url: '/profile',
          icon: 'person-outline'
        },
        {
          title: 'Mi Billetera',
          url: '/wallet',
          icon: 'wallet-outline'
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: 'chatbox-outline'
        }
      ]; 
    });
  }

  async loadData()
  {
    // Obtenemos datos del sistema
    this.server.homepage(localStorage.getItem('user_id')).subscribe((response:any) => {
      // Obtenemos version del Aplicativo
      localStorage.setItem('admin',JSON.stringify(response.admin));
    });
  }
 
  subPush(id = 0): void 
  {
    // Uncomment to set OneSignal device logging to VERBOSE  
    // OneSignal.setLogLevel(6, 0);
  
    // NOTE: Update the setAppId value below with your OneSignal AppId.
    OneSignal.setAppId("e147294a-93e6-4873-86ff-f4fec1393996");
    OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });
  
    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });

    if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null')
    {
      OneSignal.setExternalUserId(localStorage.getItem('user_id'));
      OneSignal.sendTags({user_id: localStorage.getItem('user_id')});
    }

    if(id > 0)
    {
      OneSignal.setExternalUserId(JSON.stringify(id));
      OneSignal.sendTags({user_id: id})
    }
  }
 

  logout()
  {
    // Recargamos
    this.menu.close()
    this.server.CloseSession();
    this.nav.navigateRoot('/welcome');
  }
}
