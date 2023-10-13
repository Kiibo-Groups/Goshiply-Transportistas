import { ActionSheetController, Platform, NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
@Component({
  selector: 'app-request-services',
  templateUrl: './request-services.page.html',
  styleUrls: ['./request-services.page.scss'],
})
export class RequestServicesPage implements OnInit {

  data:any;
  user:any;
  news_service:number;
  constructor(
    public server:ServerService,
    public platform: Platform,
    private nav: NavController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public statusBar: StatusBar
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    await this.platform.ready();
    this.statusBar.backgroundColorByHexString("#ffffff");
    this.statusBar.styleDefault();
    // Guardamos al usuario
    this.user = JSON.parse(localStorage.getItem('user_dat'));
    
    // Obtenemos los servicios
    await this.getServices();
  }


  /**
   * Obtenemos servicios
   */
  async getServices()
  {
    const loading = await this.loadingController.create({
      mode:'ios'
    });
    await loading.present();
     this.server.getRequestServices(localStorage.getItem('user_id')).subscribe((req:any) => {
      loading.dismiss();
      console.log(req);
      if (req.status) {
        this.data = req.data;
        this.news_service = req.newService;
      }
    });
  }

  /**
   * Aceptar un servicio
   * @param item 
   */
  async AcceptedElement(item)
  {
    const loading = await this.loadingController.create({
      message:'Aceptando servicio...',
      mode:'ios'
    });
    await loading.present();

    this.server.AcceptedElement(item.id).subscribe((req:any) => {
      loading.dismiss(); 
      if (req.status == true) {
        // this.server.presentToast("La solicitud se ha aceptado con exitó.","success");
        this.nav.navigateForward('/chat-service/'+item.service_id+'/'+item.user.id);
      }else {
        this.server.presentToast("Ha ocurrido un problema, por favor, intente más tarde","danger");
        this.getServices();
      }
    });

  }
 
  async presentActionSheet(item) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Aceptar Solicitud',
          icon: 'create',
          handler: () => {
            this.AcceptedElement(item);
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

}
