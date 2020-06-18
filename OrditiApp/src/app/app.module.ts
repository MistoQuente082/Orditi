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

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { BrMaskerModule } from 'br-mask';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DetalheZonaPageModule } from './detalhe-zona/detalhe-zona.module';
import { PerfilAmbulantePageModule } from './perfil-ambulante/perfil-ambulante.module';
import { HomePageModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrMaskerModule,

    HomePageModule,
    DetalheZonaPageModule,
    PerfilAmbulantePageModule,
    HttpClientModule,

    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    MapaModalPageModule,
    IonicStorageModule.forRoot({
      name: '__orditi',
      storeName: 'login',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    BrMaskerModule,
    Camera,
    WebView,
    NgxQRCodeModule,
    BarcodeScanner
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
