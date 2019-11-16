import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
