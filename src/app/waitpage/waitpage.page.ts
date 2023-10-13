import { ActionSheetController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service'; 


@Component({
  selector: 'app-waitpage',
  templateUrl: './waitpage.page.html',
  styleUrls: ['./waitpage.page.scss'],
})
export class WaitpagePage implements OnInit {

  constructor(
    public server: ServerService,
    public events: EventsService,
    private route: ActivatedRoute, 
    public actionSheetController: ActionSheetController,
    public nav: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){ 
    
    this.route.queryParams.subscribe( params => {
        // Obtenemos primera información
        this.server.homepage(localStorage.getItem('user_id')).subscribe((response:any) => { 
        
          this.events.publish('admin', response.admin);
          localStorage.setItem('admin', JSON.stringify(response.admin));

          setTimeout(() => {
            /**
             * Podemos validar Login
             */
            this.server.chkLog().then((req) => {
              if(req){
                if (params.redirect) {
                  this.RedirectPage(params.redirect);
                }else {
                  this.server.presentToast('Bienvenido(a) de nuevo...','success');
                  this.nav.navigateRoot('/home');
                }
              }else {
                this.nav.navigateRoot('/welcome');
              }
            });
          }, 1500);
        });
    });
  }

  RedirectPage(page)
  {
    setTimeout(() => {
      this.nav.navigateRoot(page);
    }, 1500);
  } 
}
