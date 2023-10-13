import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'; 

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  
  // url = "http://127.0.0.1:8000/api/carrier/"; // LOCAL
  url = "https://dash.goshiply.com/api/carrier/"; // PROD

  orderList: AngularFireList<any>;
  dboyList: AngularFireList<any>;
  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private fs: AngularFirestore,
    public toastController: ToastController,
    public geolocation: Geolocation
  ) { 
    this.orderList = this.db.list('/orders');
  }

  /**
   * Inicio de sesion, Registro y recuperacion
   * @param data 
   * @returns 
   */
  login(data)
  {
  	return this.http.post(this.url+'login',data)
  	    	   .pipe(map(results => results));
  }

  signup(data)
  {
    return this.http.post(this.url+'signup',data)
             .pipe(map(results => results));
  }

  /**
   * Validacion de Usuario Logeado|Registrado
   * @returns
   */
  async chkLog(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (
        localStorage.getItem("user_id") &&
        localStorage.getItem("user_id") != null
      ) {
        this.chkUser({
          user_id: localStorage.getItem("user_id"),
          role: localStorage.getItem("role"),
        }).subscribe((req: any) => {
          if (req.msg != "not_exist") {
            localStorage.setItem("user_id", req.data.id);
            localStorage.setItem("type", req.data.puesto);
            localStorage.setItem("user_dat", JSON.stringify(req.data));
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  chkUser(data: any) {
    return this.http
      .post(this.url + "chkUser", data)
      .pipe(map((results) => results));
  }


  /**
   * Datos iniciales
   * @param id  
   * @returns 
   */
  homepage(id)
  {
  	return this.http.get(this.url+'homepage_init?id='+id)
  	    	   .pipe(map(results => results));
  }
 
  /**
   * Solicitud de informacion de usuario y actualizado
   * Recuperacion de cuentas
   * @param id 
   * @returns 
   */
  userInfo(id)
  {
    return this.http.get(this.url+'userInfo/'+id)
             .pipe(map(results => results));
  }

  updateInfo(data, id)
  {
    return this.http.post(this.url+'updateInfo/'+id , data)
             .pipe(map(results => results));
  }

  forgot(data)
  {
    return this.http.post(this.url+'forgot',data)
             .pipe(map(results => results));
  }

  verify(data)
  {
    return this.http.post(this.url+'verify',data)
             .pipe(map(results => results));
  }

  updatePassword(data)
  {
    return this.http.post(this.url+'updatePassword',data)
             .pipe(map(results => results));
  }

  /**
   * Tipos de CFDI
   */
  chkCFDIType()
  {
    return this.http.get(this.url+'chkCFDIType')
    .pipe(map(results => results));
  }

  getTrucksType()
  { 
    return this.http.get(this.url+'getTrucksType')
    .pipe(map(results => results));
  }

  /**
   * Envio de encuesta
   * @param data 
   * @returns 
   */
  sendSurvey(data)
  {
    return this.http.post(this.url+'sendSurvey',data)
    .pipe(map(results => results));
  }

  /**
   * funciones de servicios
   * @param id 
   * @returns 
   */
  getServices(id)
  {
    
    return this.http.get(this.url+'getServices/'+id)
    .pipe(map(results => results));
  }

  getRequestServices(id)
  { 
    return this.http.get(this.url+'getRequestServices/'+id)
    .pipe(map(results => results));
  }

  addService(data)
  {
    return this.http.post(this.url+'saveServices',data)
    .pipe(map(results => results));
  }

  deleteService(id)
  {
    return this.http.get(this.url+'deleteServices/'+id)
    .pipe(map(results => results));
  }

  AcceptedElement(id)
  {
    return this.http.get(this.url+'AcceptedElement/'+id)
    .pipe(map(results => results));
  }

  updateService(data, id)
  { 
    return this.http.post(this.url+'updateService/'+id,data)
    .pipe(map(results => results));
  }

  AcceptService(id:number, user_to_id)
  {
    return this.http.get(this.url+'acceptService/'+id+"/"+user_to_id)
    .pipe(map(results => results));
  }

  /**
   * Obtener Wallet
   * @param user_id 
   */
  getWallet(user_id:any)
  {
    console.log(this.url+'getWallet/'+user_id);
    return this.http.get(this.url+'getWallet/'+user_id)
    .pipe(map(results => results));
  }

  /**
   * Subida de imagenes
   * @param type 
   */
  uploadImage(data)
  {
    return this.http.post(this.url+'uploadImage',data)
    .pipe(map(results => results));
  }

  /**
   * Permisos y Actualizacion de ubicacion
   * @returns 
   */
  getLocation()
  {
    return this.geolocation.watchPosition({enableHighAccuracy: true,maximumAge: 0}).pipe(map(p => p));
  }

  lastLocation(data)
  {
    return this.geolocation.getCurrentPosition({enableHighAccuracy: true,maximumAge: 0});
  }

  upLocation(data)
  {
    return this.http.post(this.url+'updateLocation',data)
             .pipe(map(results => results));
  }

  
   /**
   * Seccion para Chats
   * @param id 
   * @returns 
   */

   getChats(id)
   { 
     return this.http.get(this.url+'getChats/'+id).pipe(
       map(results => results)
     );
   }
 
   getServiceChat(user_id, user_to_id,id)
   { 
    console.log(this.url+'getServiceChat/'+user_id+"/"+user_to_id+"/"+id);
     return this.http.get(this.url+'getServiceChat/'+user_id+"/"+user_to_id+"/"+id)
     .pipe(map(results => results));
   }
 
   sendChat(data)
   {
     return this.http.post(this.url+'sendChat',data)
              .pipe(map(results => results));
   }
 
   getChat(store_id,channel,event)
   { 
     return this.http.get(this.url+'getChat/'+store_id+'/'+channel+'/'+event)
     .pipe(map(results => results));
   }
 
   createIdPusher(user_id)
   {
     return this.http.get(this.url+'createIdPusher/'+user_id)
     .pipe(map(results => results));
   }

  /**
   * Notificaiones
   * @param txt 
   * @param color 
   */
  async presentToast(txt,color, pos:any = 'top') {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : pos,
      mode:'ios',
      color:color
    });
    toast.present();
  }

  NotificationPlay()
  {
    var audio = new Audio('../../assets/notification/alert.mp3');
    audio.play();
  }

  CloseSession()
  { 
    localStorage.setItem('user_id',null);
    localStorage.setItem('user_dat',null);
    localStorage.setItem('user_type',null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_dat');
    localStorage.removeItem('user_type'); 
  }
  
  /**
   * Generado de texto aleatorio
   * @returns 
   */
  generaNss() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    const charactersLength = 6;
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
