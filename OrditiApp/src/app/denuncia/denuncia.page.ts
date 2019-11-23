import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Router } from '@angular/router';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { ModalController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AlertasService } from '../services/alertas.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.page.html',
  styleUrls: ['./denuncia.page.scss'],
})
export class DenunciaPage implements OnInit {
  map2: Map = null;
  lat: any;
  long: any;
  latLngC: any;
  localizacao: any = [];
  localMarcado: any = [];
  public campos: Campos[] = [];
  campoDiaDenuncia: any = [];
  campoHoraDenuncia: any = [];
  campoInfoDenuncia: any = [];

  // Var Camera
  public imgDenuncia = '../../assets/img/vetor.png';

  public dataDenuncia: Date = new Date();
  public horaDenuncia: Date = new Date();
  public localDenuncia;
  public infoDenuncia;

  routes = [
    {
      path: '',
      redirectTo: 'home'
    }
  ];

  returnHome() {
    this.router.navigate(['/home']);
  }

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public camera: Camera,
    public router: Router,
    private storage: Storage,
    public db: AngularFirestore,
    public modalController: ModalController) { }



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
      this.imgDenuncia = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }


  // DATA DO OCORRIDO
  mudaData(event) {
    this.dataDenuncia = new Date(event.detail.value);
    console.log('DIA', this.dataDenuncia);

  }

  mudaHora(event) {
    this.horaDenuncia = new Date(event.detail.value);
    console.log('Chegada:', this.horaDenuncia);
  }

  selectMap() {
    this.infoDenuncia = (document.getElementById("campoInfoDenuncia") as HTMLInputElement).value;
    const origem = DenunciaPage;
    this.modalController.create(
      {
        component: MapaModalPage,
        componentProps: {
          origem
        }
      }).then((modalElement) => {
        modalElement.present();
      });

      this.campos.push({
          dia: this.dataDenuncia,
          hora: this.horaDenuncia,
          info: this.infoDenuncia
      });   
      this.storage.set('campos', this.campos);
  }



  // ENVIAR DENUNCIA
  subDenuncia() {
    this.storage.clear();
    this.infoDenuncia = (document.getElementById("campoInfoDenuncia") as HTMLInputElement).value;
    if (this.dataDenuncia === undefined || this.horaDenuncia === undefined ||
      this.infoDenuncia === undefined || this.localDenuncia === undefined) {
      this.alertas.presentToast('Preencha os campos!');
    } else {
      const dados = {
        dataDenuncia: this.dataDenuncia,
        horaDenuncia: this.horaDenuncia,
        localDenuncia: this.localDenuncia,
        infoDenuncia: this.infoDenuncia
      };
      this.alertas.presentAlert('Tem certeza do que está enviando?', dados, 'denuncias')
      // COLOCA AQUI para envia dados da denuncia ao banco
      // Falta en viar a foto
      // E como tranformar o local no nome da rua
    }
  }

  ngOnInit() {
    this.storage.get('localizacao').then((localizacao) => {
      this.localizacao = localizacao || [];
      this.localMarcado = "" + this.localizacao[0].rua + " " + this.localizacao[0].regiao;
    });

    this.storage.get('campos').then((campos) => {
      this.campos = campos || [];
      this.campoDiaDenuncia = "" + this.campos[0].dia;
      this.campoHoraDenuncia = "" + this.campos[0].hora;
      this.campoInfoDenuncia = "" + this.campos[0].info;
    });
  }

  ngOnDestroy(){
    this.storage.clear();    
  }

  mapRemove() {
    //this.map2.remove(); -> Isso tava fazendo dar um erro bem grande
    this.returnHome();
  }
}

class Campos{
  dia: any;
  hora: any;
  info: any;
}
