import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppModule } from '../app.module';
import { LoginBancoService } from '../services/login/login-banco.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loading: HTMLIonLoadingElement;
  private url_banco = 'http://syphan.com.br/orditiServices/validaLogin.php';

  tipo: boolean;

  matricula: number;
  senha: string;

  user: any = AppModule.getUsuario();

  constructor(
    public router: Router,
    public fAuth: AngularFireAuth,
    public loadingController: LoadingController,
    public db: AngularFirestore,
    private loginBanco: LoginBancoService,
    public toastCtrl: ToastController
  ) { }

  async fazerLogin() {
    console.log('Tentando fazer login:');
    const { matricula, senha } = this;

    let user: any;

    await this.presentLoading(); // Carregamento enquanto espera

    try {

      if (this.matricula === undefined || this.senha === undefined) {
        // Aviso na tela
        this.presentToast('Preencha os campos');
        console.log('Campos vazios');
      }
      else {
        const dados = {
          'matricula': matricula,
          'senha': senha
        };

        let resposta_login = this.loginBanco.fazerLogin(this.url_banco, dados);
        console.log(resposta_login);
        if (resposta_login === true) {
          this.returnHome();
        }

        else if (resposta_login === false) {
          // Aviso na tela

          this.presentToast('Matricula ou Senha Incorreta!');

        } else {
          this.presentToast('Erro ao fazer login');
        }
      }

    } catch (err) {

      console.log('Erro encontrado ao conectar-se ao banco de dados: ' + err.code);

    } finally {
      // Encerra o carregamento
      this.loading.dismiss();
    }

  }

  // Senha visivel ou não
  hideShow() {
    this.tipo = !this.tipo;

  }

  // Carregando
  async presentLoading() {
    this.loading = await this.loadingController.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  // Avisos na tela
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }


  returnHome() {
    this.router.navigate(['/home']);
  }
}
