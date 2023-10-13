import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { ToastController,NavController,Platform,LoadingController,Events } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  logedd: any;
  text:any;
  dating = [];
  phone: any;
  login_view: boolean = false;
  isKeyboardHide=true;
  constructor(
    private route: ActivatedRoute,
    public server : ServerService,
    public toastController: ToastController,
    private nav: NavController,
    public loadingController: LoadingController,
    public events: Events,
    public platform: Platform,
    public statusBar: StatusBar
  ) {
    this.text = JSON.parse(localStorage.getItem('app_text'));
   }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.statusBar.backgroundColorByHexString("#ffffff");
    this.statusBar.styleDefault();
  }

  async signup(data)
  {
    const loading = await this.loadingController.create({
      mode: 'md'
    });
    await loading.present();

    this.server.signup(data).subscribe((response:any) => {
      loading.dismiss();
      console.log(response);
      if (response.status == true) {
        localStorage.setItem('user_id',response.data.id);
        localStorage.setItem('user_type',response.data.puesto);
        this.events.publish('user_login', response.data.id);
        this.nav.navigateRoot('waitpage');  
      }else {
        this.server.presentToast(response.data,"danger");
      }
    });
  } 

  goBck()
  {
    this.nav.navigateRoot('welcome');  
  }

}
