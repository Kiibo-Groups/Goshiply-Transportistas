import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  @ViewChild('content',{static:false}) private content: any;

  data:any;
  action:any;
  text:any;
  order:any;

  constructor(
    private route: ActivatedRoute,
    public server : ServerService,
    public toastController: ToastController,
    private nav: NavController,
    public loadingController: LoadingController,
    public statusBar: StatusBar
  ){
    this.text = JSON.parse(localStorage.getItem('app_text'));
  }

  ngOnInit()
  {
  }

  ionViewWillEnter()
  {

    this.statusBar.backgroundColorByHexString("#ffffff");
    this.statusBar.styleDefault();

    if(!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null')
    {
      this.nav.navigateRoot('/login');
      this.presentToast("Inicie sesión para acceder a su perfil...",'danger');
    }
    else
    {
      this.loadData();
    }
  }

  async takeAction(type)
  {    
    this.action = type;
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      mode:'ios'
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response:any) => {
      this.data  = response.data;
      this.order = response.order; 
      loading.dismiss();
    });
  }

  async update(data)
  {
    const loading = await this.loadingController.create({
      message: 'Actualizando información...',
      mode:'ios'
    });
    await loading.present();

    var allData = {
      id : localStorage.getItem('user_id'),
      password : data.password,
      type_driver: data.type_driver
    }

    this.server.updateInfo(allData, localStorage.getItem('user_id')).subscribe((response:any) => {
      loading.dismiss();
      if (response.data == 'done') {
        this.action = 0;
        this.presentToast("Actualizado con éxito...",'success');
        this.loadData();
      }else {
        this.presentToast("Ha ocurrido un problema","danger");
      }
    });
  }

  async presentToast(txt,color) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:color
    });
    toast.present();
  }

  StaffStatus(type){
  
     
  }

  logout()
  {
    this.server.CloseSession();
    this.nav.navigateForward('/welcome');
  }
}
