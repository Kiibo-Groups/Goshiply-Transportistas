import { ActionSheetController, Platform, NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.page.html',
  styleUrls: ['./list-services.page.scss'],
})
export class ListServicesPage implements OnInit {

  data:any;
  user:any;
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

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();
      // Guardamos al usuario
      this.user = JSON.parse(localStorage.getItem('user_dat'));
      // Obtenemos los servicios
      this.getServices();
    });
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
    this.server.getServices(localStorage.getItem('user_id')).subscribe((req:any) => { 
      loading.dismiss();
      if (req.status == true) {
        this.data = req.data;
      }else {
        this.server.presentToast("Ha ocurrido un problema, por favor, Intente más tarde","danger","bottom");
        this.nav.navigateRoot('/home');
      }
    });
  }

  /**
   * Eliminamos un servicio
   * @param item 
   */
  async deleteElement(item)
  {
    const loading = await this.loadingController.create({
      message:'Eliminando servicio...',
      mode:'ios'
    });
    await loading.present();

    this.server.deleteService(item.id).subscribe((req:any) => {
      loading.dismiss(); 
      if (req.status == true) {
        this.server.presentToast("Elemento eliminado con éxito.","success");
        this.getServices();
      }else {
        this.server.presentToast("Ha ocurrido un problema, por favor, intente más tarde","danger");
        this.getServices();
      }
    });

  }

   

  async presentActionSheet(item) {

    if (item.status == 0) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Opciones',
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.deleteElement(item);
            },
          },
          {
            text: 'Editar',
            icon: 'create',
            handler: () => {
              localStorage.setItem('oDataService', JSON.stringify(item));
              this.nav.navigateForward('/add-services');
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
    }else {
      this.nav.navigateForward('/chat-service/'+item.id+'/'+item.accepted_user);
    } 
  }

}
