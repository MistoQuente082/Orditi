import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  // Var Camera
  public imgPessoa;

  // Variaveis da pessoa
  public nome: string;
  public cpf: string;
  public escolaridade: string;
  public endereco: string;
  public fone: string;


  // Variaveis Do trabalho
  public produto: string;
  public pontoRef: string;
  public localAtiv: string;

  constructor(
    public alertas: AlertasService,
    public camera: Camera,
    public modalController: ModalController
  ) {

  }

  // Função para cemerqa
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
      this.imgPessoa = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });


  }


  // Função que leva a escolher um ponto no mapa
  selectMap() {
    this.modalController.create(
      {component: MapaModalPage}).then((modalElement)=>{
        modalElement.present();
      });
  }

  // Botão de cadastro
  cadastrar() {
    if (this.nome === undefined || this.cpf === undefined || this.endereco === undefined
      || this.escolaridade === undefined || this.fone === undefined || this.produto === undefined
      || this.produto === undefined || this.pontoRef === undefined || this.localAtiv === undefined) {
      this.alertas.presentToast('Preencha os campos!');
    } else {
      const dados = {
        nome: this.nome,
        cpf: this.cpf,
        fone: this.fone,
        escolaridade: this.escolaridade,
        endereco: this.endereco,
        pontoRef: this.pontoRef,
        produto: this.produto,
        localAtiv: this.localAtiv,
        //imgPessoa: this.imgPessoa
      };
      //this.alertas.subDados(dados); //Pq ele mandaria os dados antes de confirmar?
      var resp;
      resp = this.alertas.presentAlert('Deseja adicionar esta pessoa?', dados, 'ambulantes');
      console.log(resp)
      if (resp === 'Adicionar') {
        console.log('Adicionando');
        this.alertas.subDados(dados, "ambulantes");
      }
    }

  }




  ngOnInit() {
  }

}
