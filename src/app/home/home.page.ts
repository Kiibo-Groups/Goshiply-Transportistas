import {  Component,ViewChild} from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,Events,AlertController,ToastController, ModalController, MenuController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	
  admin:any;
  data:any;
  user: any;
  type_unity:any = null;
  carga_maxima:any = null;
  origin1:any = null;
  destino1:any = null;

  origin2:any = null;
  destino2:any = null;
  
  origin3:any = null;
  destino3:any = null;

  type_unity_view:boolean = false;
  carga_maxima_view:boolean = false;
  destinos_view:boolean = false;

  trucks:any = [];

  chat_pending:boolean = false;
  news_msgs:number;
  news_service:number;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public toastController: ToastController,
    public alertController: AlertController,
    public server : ServerService,
    private nav: NavController,
    public events: Events,
    public loadingController : LoadingController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public audio: NativeAudio,
    public modalController: ModalController,
    public menu: MenuController,
  )
  {
    this.admin = JSON.parse(localStorage.getItem("admin")); 
  }

  ngOnInit(){}

  ionViewDidEnter(){
    // Verificamos si existe el user id
    if(!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null')
    {
      this.server.presentToast("Inicie sesión para acceder a su perfil",'danger');
      this.nav.navigateRoot('/waitpage');
    }else {
      // Obtenemos info user
      this.userInfo();
      this.chkNewChats();
      this.chkNewRequestService();
    }
  }

  ionViewWillEnter()
  {
    this.platform.ready().then( () => {
      this.menu.enable(true);
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();
    });
  }

  userInfo()
  {
    this.server.userInfo(localStorage.getItem('user_id')).subscribe((req:any) => { 
      if (req.status == true) { 
        this.user   = req.data;
        localStorage.setItem('user_dat', JSON.stringify(this.user));
        this.events.publish('user_data', this.user);
        this.events.publish('user_login', this.user.id); 
        if (this.user.status == 1) {
          // Comenzamos a solicitar pedidos
          this.chkInfoUser();
          // Obtenemos los tipos de camiones
          this.getTrucksType();
        }else {
          this.nav.navigateForward('/locked');
        }
      }
    });
  }

  /**
   * Validamos informacion de usuario
   */
  chkInfoUser()
  {
    if (this.user.empresa == null || 
      this.user.ine == null || 
      this.user.rfc == null || 
      this.user.cfdi_type == null || 
      this.user.regimen_f == null) { // Validamos datos fiscales
        this.server.presentToast("Por favor, Rellena tu información fiscal","danger");
        this.server.NotificationPlay();
        this.nav.navigateForward('/detail');
    }else { // Validamos informacion del vehiculo
      if (this.user.marca == null || 
        this.user.descript_vehiculo == null || 
        this.user.year == null || 
        this.user.motor_number == null || 
        this.user.pic_back == null  || 
        this.user.pic_front == null  || 
        this.user.pic_left == null  ||  
        this.user.permiso_sct == null  || 
        this.user.permiso_number == null  || 
        this.user.aseguradora == null  || 
        this.user.poliza == null  || 
        this.user.poliza_doc == null) {
          this.server.presentToast("Por favor, Termina la información de tu vehiculo","danger");
          this.server.NotificationPlay();
          this.nav.navigateForward('/details-vehicle');
        }
    }
  }

  chkNewChats()
  {
    this.server.getChats(localStorage.getItem('user_id')).subscribe((response:any) => {
      if (response.status) { 
        this.news_msgs = response.news_msgs;
      }
    });
  }

  chkNewRequestService()
  {
    this.server.getRequestServices(localStorage.getItem('user_id')).subscribe((req:any) => {
      if (req.status) {
        console.log(req);
        this.news_service = req.newService;
      }
    });
  }

  /**
   * Obtenemos tipo de Camiones
   */
  getTrucksType()
  {
    this.server.getTrucksType().subscribe((req:any) => { 
      if (req.status == true) {
        this.trucks = req.data;
      }
    });
  }

  /**
   * Guardamos Encuesta inicial
   */
  async saveSurvey()
  {
    const loading = await this.loadingController.create({
      message: 'Enviando informacion...',
      mode:'ios'
    });
    await loading.present();

    if (this.type_unity != null && this.carga_maxima != null  ) {
      let allData = {
        carrier_id       : localStorage.getItem('user_id'),
        type_unity    : this.type_unity,
        carga_maxima  : this.carga_maxima,
        origin1        : this.origin1,
        destino1       : this.destino1,
        origin2        : this.origin2,
        destino2       : this.destino2,
        origin3        : this.origin3,
        destino3       : this.destino3
      };

      this.server.sendSurvey(allData).subscribe((req:any) => {
        loading.dismiss();
        console.log(req);
        if (req.status == true) {
          this.userInfo();
        }
      });
    }else {
      loading.dismiss();
      this.server.NotificationPlay();
      this.server.presentToast("Aún falta información de la encuesta","danger");
    }

  }

}
