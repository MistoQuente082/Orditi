import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    public db: AngularFirestore,
    public alertController: AlertController,
    public toastController: ToastController,
    public router: Router
  ) { }

  async presentAlert(message, dados, local) {
    var resp: string = ' ';

    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',

        }, {
          text: 'Adicionar',
          handler: async () => {
            const resp = 'Adicionar'; //Retorna o que deve ser feito
            this.subDados(dados, local)
            //this.router.navigate(['/']);
            console.log('Executando')
          }
        }
      ]
    });

    await alert.present();
    return resp;
    console.log(resp);
  }

  // Envia ao Banco de Dados
  subDados(dados, local: string) {
    this.db.collection(local).doc(dados.cpf).set(dados);
    console.log("Documento adicionado a " + local);
  }

  // Mostra um toast na tela
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}