import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, AlertController, IonSlides } from '@ionic/angular';
import { ServerService } from '../service/server.service'; 
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild(IonSlides,{static:false}) slides: IonSlides;
  
  
  index:number = 0;
  welcome:boolean = false;
  constructor(
    private platform: Platform,  
    public nav : NavController,
    public menu: MenuController,  
    public server: ServerService,
    private route: Router,
    public alertController: AlertController,
    public statusBar: StatusBar
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter(){
    this.platform.ready().then(() => { 
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();
      
      this.menu.close()
      this.menu.enable(false);
      this.slides.ionSlideNextEnd.subscribe(() => {
        this.index++;
      });
  
      this.slides.ionSlidePrevEnd.subscribe(() => {
        this.index--; 
      });

    });
  }

  next() {
    
    this.slides.isEnd().then(flag => { 
      console.log(flag);
      if (!flag) { 
        this.slides.slideNext();
      }else {
        // Llegamos al final
        console.log("Llegamos al final");
      }
    });
  }

  Ready() {
    this.welcome = true;
  }

  goToLogin() {
    this.route.navigate(['/login']);
    this.welcome = false;
  }

  goToSingup() {
    this.route.navigate(['/signup']);
    this.welcome = false;
  }

  omit()
  { 
    this.index = 2;
    this.slides.slideTo(2); 
  }

}
