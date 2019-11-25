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
      icon: 'map'
    },
    {
      title: 'Buscar Regiao',
      url: '/busca',
      icon: 'search'
    },

    {
      title: 'Como me tornar um micro Empreendedor Itinerante?',
      url: '/informacoes',
      icon: 'information-circle'
    },
    {
      title: 'Fazer Denuncia',
      url: '/denuncia',
      icon: 'hand'
    },

    {
      title: 'perfil',
      url: '/perfil-ambulante',
      icon: 'hand'
    },
    {
      title: 'Eventos Temporarios',
      url: '/eventos',
    },
    {
      title: 'Sou um fiscal',
      url: '/login',
      icon: 'log-in'
    }
  ];

  public appPagesFiscais = [
    {
      title: 'Mapa',
      url: '/home',
      icon: 'map'
    },

    {
      title: 'Buscar Pessoa ou Regiao',
      url: '/busca',
      icon: 'search'
    },
    {
      title: 'Cadastro de Ambulante',
      url: '/cadastro',
      icon: 'person-add'
    },
    {
      title: 'Autuação',
      url: '/denuncia',
      icon: 'hand'
    },

    {
      title: 'Eventos Temporários',
      url: '/home',
      icon: 'calendar'
    },


  ];

  public out = {
    title: 'Sair',
    click: 'sair()',
    url: '/home',
    icon: 'log-out'
  };

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

  sair() {
    AppModule.setUsuario(null);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }
}
