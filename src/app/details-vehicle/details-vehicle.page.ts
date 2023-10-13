import { Component, OnInit,Renderer2,ViewChild, Inject, ElementRef } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,Events,AlertController,ToastController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-details-vehicle',
  templateUrl: './details-vehicle.page.html',
  styleUrls: ['./details-vehicle.page.scss'],
})
export class DetailsVehiclePage implements OnInit {

  customPickerOptions: any;
  data:any;
  admin:any;
  user: any;


  truckView:boolean = false;
  descript_vehicView:boolean = false;
  anioView:boolean = false;
  colorView:boolean = false;
  numberMView:boolean = false;
  typetruckView:boolean = false;
  cargaMaxView:boolean = false;
  permisoSctView:boolean = false;
  permisoNumView:boolean = false;
  aseguradoraView:boolean = false;
  polizaView:boolean = false;

  previewPic:any = '';
  imageURI: any;

  trucks:any = [];
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public server : ServerService,
    private nav: NavController,
    public platform: Platform,
    public events: Events,
    public loadingController : LoadingController,
    public modalController: ModalController,
    public statusBar: StatusBar
  )
  {
    
  }

  ionViewWillEnter()
  {
    this.admin = JSON.parse(localStorage.getItem("admin"));
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();
      // Obtenemos la informacion del usuario
      this.userInfo();
      // Obtenemos los tipos de camiones
      this.getTrucksType();
    });
  }

  ngOnInit(){}

  getTrucksType()
  {
    this.server.getTrucksType().subscribe((req:any) => { 
      if (req.status == true) {
        this.trucks = req.data;
      }
    });
  }

  userInfo()
  {
    this.server.userInfo(localStorage.getItem('user_id')).subscribe((req:any) => { 
      if (req.status == true) {
        this.user   = req.data; 
        localStorage.setItem('user_dat', JSON.stringify(this.user));
        this.events.publish('user_data', this.user);
      }
    });
  }

  saveInfo()
  {
    this.server.updateInfo(this.user, localStorage.getItem('user_id')).subscribe((data:any) => { 
      if (data.data != 'error') {
        this.userInfo();
        this.server.presentToast("Información actualizada con exito.","success");
      }
    });
  }
 
  openFileInput(type)
  {
    var input = document.createElement('input');
        input.type = 'file';
        input.id   = 'file';
        input.accept = 'image/png,image/jpeg';
    
        input.onchange = e => {  
          this.fileChange(e,type);
        }
    
        input.click();
  }
  
  fileChange(event, type) {
    if (event.target.files && event.target.files[0]) {
      this.imageURI = event.target.files[0];
      let reader = new FileReader();
      reader.onload = (event:any) => {
        let ext =  (/[.]/.exec(this.imageURI.name)) ? /[^.]+$/.exec(this.imageURI.name)[0] : undefined;  
        if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') { // Es una imagen.
          this.previewPic = event.target.result;
          const filename = this.server.generaNss()+'.jpg';
          // Subimos
          this.UploadPics(filename, type).then((req:any) => {  
          }).catch(err => {
            console.log(err);
          });
        }
      }
      reader.readAsDataURL(event.target.files[0]);  // to trigger onload
    }
  }

  async UploadPics(filename, type)
  { 
    const loading = await this.loadingController.create({
      message: 'Subiendo archivo...',
      mode:'ios',
      duration:1500
    });
    await loading.present();

    let formData = new FormData();
    formData.append('file',this.imageURI,filename);
    formData.append('type_up',type);
    formData.append('user_id',localStorage.getItem('user_id'));

    try {
      this.server.uploadImage(formData).subscribe((req:any) => {
        console.log(req);
        loading.dismiss();

        if (req.status == true) {
          switch (type) {
              
            case 'poliza':
              this.user.poliza_doc = req.name_file;
              break;
            case 'pic_front':
              this.user.pic_front = req.name_file;
              break;
            case 'pic_back':
              this.user.pic_back = req.name_file;
              break;
            case 'pic_right':
              this.user.pic_right = req.name_file;
              break;
            case 'pic_left':
              this.user.pic_left = req.name_file;
            break;
          }
          this.saveInfo();
        }else {
          this.server.presentToast(req.data,"danger");
        }
      });

    } catch (error) {
      console.log(error);
    }
  }

}
