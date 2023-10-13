import { ActionSheetController, Platform, NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../service/server.service';
 
@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.page.html',
  styleUrls: ['./add-services.page.scss'],
})
export class AddServicesPage implements OnInit {

  data:any;
  user:any;

  portada:any = null;
  ubicacion:any = null;
  destino:any = null;
  fecha:any = null;
  hora:any = null;
  tipo_flete:any = null;
  precio_normal:any = null;
  precio:any = null;

  
  previewPic:any = '';
  imageURI: any;

  update:boolean = false;
  service_id:any = 0;
  constructor(
    public server:ServerService,
    public platform: Platform,
    private nav: NavController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      // Guardamos al usuario
      this.user = JSON.parse(localStorage.getItem('user_dat'));

      if (localStorage.getItem('oDataService') && localStorage.getItem('oDataService') != null) {
        // Obtenemos los servicios
        this.getService(JSON.parse(localStorage.getItem('oDataService'))); 
      }
    });
  }


  /**
   * Obtenemos el servicio
   */
  async getService(dat:any = [])
  {
    this.update = true;
    this.service_id = dat.id;
    this.ubicacion  = dat.ubicacion;
    this.destino  = dat.destino;
    this.fecha  = dat.fecha;
    this.hora = dat.hora;
    this.tipo_flete = dat.tipo_flete;
    this.precio_normal  = dat.precio_normal;
    this.precio = dat.precio;
  }

  /**
   * Creamos el servicio
   */
  async addService()
  {
    const loading = await this.loadingController.create({
      message:'Enviando servicio...',
      mode:'ios'
    });
    await loading.present();

    if (this.ubicacion == null || 
      this.destino == null || 
      this.fecha == null || 
      this.hora == null || 
      this.tipo_flete == null || 
      this.precio_normal == null || 
      this.precio == null ) {  
        loading.dismiss();
        this.server.NotificationPlay();
        this.server.presentToast("Por favor, rellena todos los datos","danger");
    }else {
      loading.dismiss(); 
      if (!this.update) {
        if (this.portada != null) {
          // Si todo esta en orden subimos primero la imagen
          this.UploadPics();
        }else {
          this.server.presentToast("Por favor, sube una imagen descriptiva","danger");
        }
      }else {
        this.updateInfo();
      }
    }

  }

  openFileInput()
  {
    var input = document.createElement('input');
    input.type = 'file';
    input.id   = 'file';
    input.accept = 'image/png,image/jpeg';

    input.onchange = e => {  
      this.fileChange(e);
    }

    input.click();
  }
  
  fileChange(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageURI = event.target.files[0];
      let reader = new FileReader();
      reader.onload = (event:any) => {
        let ext =  (/[.]/.exec(this.imageURI.name)) ? /[^.]+$/.exec(this.imageURI.name)[0] : undefined;  
        if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') { // Es una imagen.
          this.previewPic = event.target.result;
          this.portada = this.server.generaNss()+'.jpg';
        }
      }
      reader.readAsDataURL(event.target.files[0]);  // to trigger onload
    }
  }

  async UploadPics()
  { 
    const loading = await this.loadingController.create({
      message: 'Subiendo archivo...',
      mode:'ios',
      duration:1500
    });
    await loading.present();

    let formData = new FormData();
    formData.append('file',this.imageURI,this.portada);
    formData.append('type_up','servicios');
    formData.append('user_id',localStorage.getItem('user_id'));

    try {
      this.server.uploadImage(formData).subscribe((req:any) => { 
        loading.dismiss(); 
        if (req.status == true) {
          let allData = {
            'carrier_id': localStorage.getItem('user_id'),
            'portada'   : req.name_file,
            'ubicacion' : this.ubicacion,
            'destino' : this.destino,
            'fecha' : this.fecha,
            'hora' : this.hora,
            'tipo_flete' : this.tipo_flete,
            'precio_normal' : this.precio_normal,
            'precio' : this.precio,
            'status' : 0
          };
          this.server.addService(allData).subscribe((req:any) => {
            console.log(req);
            if (req.status == true) {
              this.server.presentToast("Servicio agregado con éxito.","success");
              this.nav.navigateRoot('/list-services');
            }
          });
        }else {
          this.server.presentToast(req.data,"danger");
        }
      });

    } catch (error) {
      console.log(error);
    }
  }

  updateInfo()
  {
    let allData = {
      'carrier_id': localStorage.getItem('user_id'), 
      'ubicacion' : this.ubicacion,
      'destino' : this.destino,
      'fecha' : this.fecha,
      'hora' : this.hora,
      'tipo_flete' : this.tipo_flete,
      'precio_normal' : this.precio_normal,
      'precio' : this.precio,
      'status' : 0
    };
    this.server.updateService(allData,this.service_id).subscribe((req:any) => {
      if (req.status == true) {
        localStorage.removeItem('oDataService');
        this.server.presentToast("Servicio Actualizado con éxito.","success");
        this.nav.navigateRoot('/list-services');
      }
    });
  }

  back() {
    localStorage.removeItem('oDataService'); 
    this.nav.navigateRoot('/list-services');
  }
}