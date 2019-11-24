import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { AlertasService } from '../alertas.service';
import { PerfilAmbulantePage } from 'src/app/perfil-ambulante/perfil-ambulante.page';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  datocodificado: any;
  datoscaneado: {};

  constructor(
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    public alertas: AlertasService
  ) {

  }

  LeerCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData;
      
      // AQUI VOCE DEVE CHAMAR O BANCO, COM A LISTA DE AMBULANTES CADASTRADOS

      // if (this.datoscaneado === pessoacadastrada) {
      //   this.presentModal();
      // } else {
      //   this.alertas.presentToast('Nenhum ambulante cadastrado com esse código');
      // }
    })
      .catch(err => {
        console.log("Error", err);
      });
  }

  CodificarTexto(cpf) {
    let dato;
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, cpf).then(
      encodedData => {
        this.datocodificado = encodedData;
        dato = encodedData;
      },
      err => {
        console.log("Un error ha ocurrido: " + err);
      }
    );
    return dato;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PerfilAmbulantePage,
      componentProps: { value: 123 }
    });

    await modal.present();

  }

}