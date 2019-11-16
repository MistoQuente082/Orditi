import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public usuario: any = AppModule.getUsuario();
  public status: boolean = AppModule.getUsuarioStatus();

  public appPages = [
    {
      title: 'Mapa',
      url: '/home',
    },
    {
      title: 'Cadastro novo',
      url: '/cadastro',
    },
    {
      title: 'Autuação',
      url: '/home',
    },
    {
      title: 'Fazer Denuncia',
      url: '/denuncia',
    },
    {
      title: 'Como me tornar um micro Empreendedor Itinerante?',
      url: '/home',
    },
    {
      title: 'Sou um fiscal',
      url: '/login',
      icon: 'ios-share'
    }
  ];

  public appPagesFiscais = [
    {
      title: 'Mapa',
      url: '/home',
    },
    {
      title: 'Autuação',
      url: '/autuacao',
    },
    {
      title: 'Cadastro de Ambulante',
      url: '/cadastro',
    },
    {
      title: 'Eventos Temporários',
      url: '/login',
      icon: 'ios-share'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
    console.log(this.status);
    console.log(AppModule.getUsuarioStatus())
  }

  Fiscal() {
    return AppModule.getUsuarioStatus();
    console.log(AppModule.getUsuarioStatus())
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
