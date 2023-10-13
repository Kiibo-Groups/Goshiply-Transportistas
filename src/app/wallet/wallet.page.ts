import { ActionSheetController, Platform, NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

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
    this.statusBar.backgroundColorByHexString("#A02428");
    this.statusBar.styleDefault();
    // Guardamos al usuario
    this.user = JSON.parse(localStorage.getItem('user_dat'));
    
    // Obtenemos la billetera
    await this.getWallet();
  }


  /**
   * Obtenemos servicios
   */
  async getWallet()
  {
    const loading = await this.loadingController.create({
      mode:'ios'
    });
    await loading.present();
     this.server.getWallet(localStorage.getItem('user_id')).subscribe((req:any) => {
      loading.dismiss();
      console.log(req);
      if (req.status) {
        this.data = req;
      }
    });
  }

}
