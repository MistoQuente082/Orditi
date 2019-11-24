import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { AlertasService } from '../alertas.service';
import { PerfilAmbulantePage } from 'src/app/perfil-ambulante/perfil-ambulante.page';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  datocodificado: any;
  datoscaneado: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    public alertas: AlertasService,
    public db: AngularFirestore,
  ) {

  }

  LeerCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData.text; //osso aqui tem que ser uma string
      this.db.collection("ambulantes").doc(this.datoscaneado).get().toPromise().then(doc => {
        if (!doc.exists) {
          this.alertas.presentToast("Nenhum ambulante cadastrado com esse código");
        } else {
          this.presentModal(doc);
        }
      })
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

  async presentModal(item) {
    const modal = await this.modalController.create({
      component: PerfilAmbulantePage,
      componentProps: { pessoa: item }
    });

    await modal.present();

  }

}