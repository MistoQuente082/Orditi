import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { ModalController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';



@Component({
  selector: 'app-autuacao',
  templateUrl: './autuacao.page.html',
  styleUrls: ['./autuacao.page.scss'],
})
export class AutuacaoPage implements OnInit {

  public ambulante;

  public dataAut;
  public horaAut;
  public infoAut;
  public localAut;

  // Var Camera
  public imgAut = '../../assets/img/vetor.png';



  constructor(
    public alertas: AlertasService,
    public camera: Camera,
    public modalController: ModalController
  ) { }




  // Função para camera
  cam() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imgAut = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });


  }



  // DATA DO OCORRIDO
  mudaData(event) {
    this.dataAut = new Date(event.detail.value);
    console.log('DIA', this.dataAut);

  }

  mudaHora(event) {
    this.horaAut = new Date(event.detail.value);
    console.log('Chegada:', this.horaAut);
  }

  subAut() {
    if (this.dataAut === undefined || this.horaAut === undefined ||
      this.infoAut === undefined || this.localAut === undefined || 
      this.ambulante === undefined) {
      this.alertas.presentToast('Preencha os campos!');
    } else {
      const dados = {
        dataAut: this.dataAut,
        horaAut: this.horaAut,
        localAut: this.localAut,
        infoAut: this.infoAut
      };

      // COLOCA AQUI para envia dados da Aut ao banco
      // Falta en viar a foto
      // E como tranformar o local no nome da rua
    }

  }

  selectMap() {
    const origem = AutuacaoPage;
    this.modalController.create(
      {
        component: MapaModalPage,
        componentProps: {
          origem
        }
      }).then((modalElement) => {
        modalElement.present();
      });
  }


  ngOnInit() {
  }

}
