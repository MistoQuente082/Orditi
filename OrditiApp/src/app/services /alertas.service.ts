import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public router: Router
  ) { }

  async presentAlert(message) {

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
            this.subDados(message);
            this.router.navigate(['/']);
          }
        }
      ]
    });

    await alert.present();
  }

  // Envia ao Banco de Dados
  subDados(dados) {}

  // Mostra um toast na tela
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
