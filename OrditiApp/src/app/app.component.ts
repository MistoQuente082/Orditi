import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppModule } from './app.module';
import { LoginBancoService } from './services/login/login-banco.service';
import { ListaAmbulantesService } from './services/lista-ambulantes/lista-ambulantes.service';
import { SqlOrditiService } from './services/banco/sql-orditi.service';

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
      title: 'Pesquisar Região',
      url: '/busca',
      icon: 'search'
    },
    {
      title: 'Fazer Denúncia',
      url: '/denuncia',
      icon: 'hand'
    },
    {
      title: 'Micro-empreendedor?',
      url: '/informacoes',
      icon: 'information-circle'
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
      title: 'Pesquisar',
      url: '/busca',
      icon: 'search'
    },
 
    {
      title: 'Gerar Listas',
      url: '/filtro-busca',
      icon: 'albums'
    },
    {
      title: 'Cadastro de Ambulante',
      url: '/cadastro',
      icon: 'person-add'
    },
    {
      title: 'Notificar',
      url: '/denuncia',
      icon: 'hand'
    }


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
    private loginBanco: LoginBancoService,
    private listaAmbulante: ListaAmbulantesService,
    private sqlOrditi: SqlOrditiService) {
    this.initializeApp();
    this.sqlOrditi.receberDados('http://localhost/orditiServices/listarAmbulantes.php').subscribe(data => {
      this.listaAmbulante.inserir('lista', data)
      this.listaAmbulante.recuperar('lista').then((data)=>{
        console.log(data)
      });
    })
    console.log(this.status);
    console.log(AppModule.getUsuarioStatus())
  }

  Fiscal() {
    return this.loginBanco.res_usuario;
  }

  sair() {
    this.loginBanco.remover('fiscal')
    return this.Fiscal();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }
}
