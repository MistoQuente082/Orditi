import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { ModalController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { CameraService } from '../services/camera/camera.service';



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
  public imgAut;



  constructor(
    public alertas: AlertasService,
    public camera: Camera,
    public modalController: ModalController,
    public usarCamera: CameraService
  ) {
    this.imgAut = "../../assets/img/denuncias.png";
  }




  // Função para camera

  cam() {
    this.usarCamera.presentActionSheet();

    this.imgAut = this.usarCamera.imgPessoa;

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
