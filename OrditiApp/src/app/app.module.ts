import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { MapaModalPageModule } from './mapa-modal/mapa-modal.module';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from '@angular/fire'; //Necessário para qualquer coisa do Firebase
import { environment } from '../environments/environment'; //As informações do Arquivo do firebase estão lá

import { AngularFirestoreModule } from '@angular/fire/firestore'; //O Database 
import { AngularFireStorageModule } from '@angular/fire/storage'; //Inútil, porém não sei
import { AngularFireAuthModule } from '@angular/fire/auth'; //Autenticação
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { DetalheZonaPage } from './detalhe-zona/detalhe-zona.page';
import { BrMaskerModule } from 'br-mask';
import { WebView } from '@ionic-native/ionic-webview/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrMaskerModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    MapaModalPageModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    BrMaskerModule,
    Camera,
    WebView
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private static status: boolean = false;
  private static usuario: any = null; //Variável onse se armazena os dados do fiscal logado
  //Função para pegar os dados do fiscal
  static getUsuario() {
    return this.usuario;
  }
  static getUsuarioStatus() {
    if (this.getUsuario() === null) {
      return false
    } else {
      return true
    }
  }
  //Função para alterar o fiscal logado
  static setUsuario(user: any) {
    this.usuario = user;
  }
}
