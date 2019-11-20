import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppModule } from '../app.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loading: HTMLIonLoadingElement;

  tipo: boolean;

  matricula: number;
  senha: string;

  user: any = AppModule.getUsuario();

  constructor(
    public router: Router,
    public fAuth: AngularFireAuth,
    public loadingController: LoadingController,
    public db: AngularFirestore,
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

        // Autenticação por email e senha
        // await this.fAuth.auth.signInWithEmailAndPassword(email, senha);
        // const currentUser = firebase.auth().currentUser; -> Define o usuario como aquele logado
        user = this.db.collection('fiscais').doc(matricula.toString()).get().toPromise()
          .then(dados => {

            if (!dados.exists) { // Checa se existe um documento no local indicado
              console.log('Matrícula não encontrada');
              // Aviso na tela
              this.presentToast('Matricula ou Senha Incorreta!');
            } else { // Ou seja, há um fiscal cadastrado com essa matrícula
              console.log('Matrícula encontrada');
              user = dados.data();
              if (senha === user.senha) { // Checa se as senhas batem
                console.log('Usuário logado!' + user.senha);
                AppModule.setUsuario(user); // Trocar this.usuario por uma letiável global de usuário

                console.log(AppModule.getUsuario());

                this.returnHome();

              } else {
                // Aviso na tela
                this.presentToast('Matricula ou Senha Incorreta!');
                console.log('Senha Incorreta!');
              }
            }

          })
          .catch(err => {
            console.log('Erro encontrado: ' + err);
          });
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
