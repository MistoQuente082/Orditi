import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QrCodeService } from '../services/qrCode/qr-code.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  public pessoa;

  public mostrar: boolean;


  constructor(
    public qrCode: QrCodeService) {
  }

  // MOSTRA NO HTML SE OUVER DADOS
  verifiPessoa() {
    if (this.pessoa) {
      this.mostrar = true;
      
    }
  }


  ngOnInit() {


    // AQUI ELE ABRE O LEITOR DE QRCODE
    this.qrCode.LeerCode();

    //RECEBE O DADOA (OU DEVERIA RECEBER)
    this.pessoa = this.qrCode.datoscaneado;
    this.verifiPessoa();


  }

}
