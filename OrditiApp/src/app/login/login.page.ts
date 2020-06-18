import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { LoadingController, ToastController } from '@ionic/angular';

import { AppModule } from '../app.module';
import { LoginBancoService } from '../services/login/login-banco.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loading: HTMLIonLoadingElement;
  private url_banco = 'http://syphan.com.br/orditiServices/validaLogin.php';
  public res_usuario: any = false;

  tipo: boolean;

  matricula: string;
  senha: string;

  user: any = AppModule.getUsuario();

  constructor(
    public router: Router,
    public httpClient: HttpClient,
    public loadingController: LoadingController,
    private loginBanco: LoginBancoService,
    public toastCtrl: ToastController
  ) { }

  async fazerLogin(resp) {
    console.log('Tentando fazer login:');
    let user: any;

    await this.presentLoading(); // Carregamento enquanto espera

    try {
      if (resp === true) {
        this.returnHome();
      }

      else if (resp === false) {
        // Aviso na tela

        this.presentToast('Matricula ou Senha Incorreta!');

      } else {
        this.presentToast('Erro ao fazer login');
      }


    } catch (err) {

      console.log('Erro encontrado ao conectar-se ao banco de dados: ' + err.code);

    } finally {
      // Encerra o carregamento
      this.loading.dismiss();
    }

  }

  // Recebe os dados
  receberDados(url) {
    console.log('campos vazios?', this.matricula, this.senha);
    if (this.matricula === undefined || this.senha === undefined
      ||  this.matricula === null || this.senha === null) {
      // Aviso na tela
      this.presentToast('Preencha os campos');
      console.log('Campos vazios');
    }
    else {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const dados = {
        'matricula': this.matricula,
        'senha': this.senha
      };
      let enviar = {
        token: 39158,
        dados: dados
      }

      this.httpClient.post(
        url,
        enviar,
        { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
        .subscribe(data => {
          console.log('Não houve nenhum erro no Banco: ', data)
          console.log(data);
          if (data['retorno'] == 1) {
            this.fazerLogin(true);
            this.loginBanco.inserir('fiscal', data['dados']);
          }

          if (data['retorno'] == 0) {
            this.fazerLogin(false);


          }


        }, error => {
          console.log('Erro ao tentar fazer login pelo Banco: ', error);
          this.fazerLogin('erro');


        });
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
