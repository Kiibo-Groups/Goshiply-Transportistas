import { Component, OnInit,Renderer2,ViewChild, Inject, ElementRef } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,Events,AlertController,ToastController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class DetailPage {
 
  data:any;
  admin:any;
  user: any;

  rfcView:boolean = false; 
  empresa:boolean = false;
  cfdiView:boolean = false;
  regimeniView:boolean = false;

  changePicFlag:boolean = false;
  previewPic:any = '';
  imageURI: any;

  inePic:any;
  cfdis:any = [];
  regimenes:any = [];
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
      // Obtenemos la informacion de facturacion
      this.chkCFDIType();
    });
  }

  ngOnInit()
  {
    
  }

  chkCFDIType()
  {
    this.server.chkCFDIType().subscribe((req:any) => {
      if (req.status == true) {
        this.cfdis = req.cfdi;
        this.regimenes = req.regimen;
      }
    });
  }

  userInfo()
  {
    this.server.userInfo(localStorage.getItem('user_id')).subscribe((req:any) => { 
      if (req.status == true) {
        this.user   = req.data;
        this.inePic = req.ine;
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
          const filename = this.server.generaNss()+'.jpg';
          // Subimos
          this.UploadPics(filename).then((req:any) => {  
          }).catch(err => {
            console.log(err);
          });
        }
      }
      reader.readAsDataURL(event.target.files[0]);  // to trigger onload
    }
  }

  async UploadPics(filename)
  { 
    const loading = await this.loadingController.create({
      message: 'Subiendo archivo...',
      mode:'ios',
      duration:1500
    });
    await loading.present();

    let formData = new FormData();
    formData.append('file',this.imageURI,filename);
    formData.append('type_up',"INE_UPLOAD");
    formData.append('user_id',localStorage.getItem('user_id'));

    try {
      this.server.uploadImage(formData).subscribe((req:any) => {
        console.log(req);
        loading.dismiss();

        if (req.status == true) {
          this.user.ine = req.name_file;
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