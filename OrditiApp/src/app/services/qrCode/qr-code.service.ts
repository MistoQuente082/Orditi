import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  datocodificado: any;
  datoscaneado: any;
  novoCodigo: any;


  constructor(
    private barcodeScanner: BarcodeScanner
  ) { }
  // Leitor
  LeerCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData;
      

    })
      .catch(err => {
        console.log('Error', err);
      });
    
  }

  // Gerador
  CodificarTexto(ambulante) {

    this.datocodificado = ambulante;
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.datocodificado)
      .then(
        encodedData => {
          this.novoCodigo = encodedData;
        },
        err => {
          console.log('Un error ha ocurrido: ' + err);
        }
      );

  }

}
