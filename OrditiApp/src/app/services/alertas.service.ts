import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    public db: AngularFirestore,
    public modalCtrl: ModalController,
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
            this.router.navigate(['/home']);
            this.presentToast('Executado com sucesso!')
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
    if (local === 'ambulantes') {
      this.db.collection(local).doc(dados.cpf).get().toPromise().then(doc => {
        if (!doc.exists) {
          this.db.collection(local).doc(dados.cpf).set(dados);
        }
        else {
          this.presentToast("Ja existe um ambulante cadastrado com esse CPF!")
        }
      })
    } else {
      this.db.collection(local).add(dados);
    }
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
  //fUNCOES UTEIS QUE NAO PODEM SER REAPRIVEITADAS - USA PRA COPIAR
  async presentModal(pagina, componentes) {
    const modal = await this.modalCtrl.create({
      component: pagina,
      componentProps: {
        info: componentes
      }
    });
    return await modal.present();
  }
  async dismiss(pagina) {
    await pagina.modalCtrl.dismiss();
  }
}
