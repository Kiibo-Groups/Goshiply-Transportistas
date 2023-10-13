import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ChatPagePageModule } from './chat-page/chat-page.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'; 
 
// Firebase RealTime DataBase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment.prod';

// Audio Notification
import { NativeAudio } from '@ionic-native/native-audio/ngx'; 

// Camera
import { Camera } from '@ionic-native/camera/ngx'; 
import { FileTransfer } from '@ionic-native/file-transfer/ngx'; 

// App Version
import { AppVersion } from '@ionic-native/app-version/ngx'; 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      // _forceStatusbarPadding: true,
      scrollPadding: false,
      scrollAssist: true
    }),
    AppRoutingModule,
    HttpClientModule,
    
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ChatPagePageModule,  

    
  ],
  providers: [
    Geolocation,
    NativeGeocoder,
    StatusBar,
    SplashScreen, 
    NativeAudio, 
    Camera, 
    AppVersion,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
