import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { ToastController,NavController,Platform,LoadingController,Events, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  phone = "";
  password = "";
  
  constructor(
    public statusBar: StatusBar,
    private route: ActivatedRoute,
    public server : ServerService,
    public toastController: ToastController,
    private nav: NavController,
    public loadingController: LoadingController,
    public events: Events,
    public menu: MenuController
  ){

  }

  ngOnInit()
  {
    this.statusBar.backgroundColorByHexString("#ffffff");
    this.statusBar.styleDefault();
  }

  ionViewWillEnter(){
    this.menu.enable(false);
  }

  async login(data)
  {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.server.login(data).subscribe((response:any) => {
      loading.dismiss();
      if(response.status != true)
      {
        this.server.presentToast(response.data,'danger');
      }
      else
      { 
        localStorage.setItem('user_id',response.data.id);
        localStorage.setItem('user_type',response.data.puesto);
        this.events.publish('user_login', response.data.id);
        this.nav.navigateRoot('waitpage');  
      }
    });
  }
 
}
