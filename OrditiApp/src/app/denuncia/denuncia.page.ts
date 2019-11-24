import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Router } from '@angular/router';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { ModalController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AlertasService } from '../services/alertas.service';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.page.html',
  styleUrls: ['./denuncia.page.scss'],
})
export class DenunciaPage implements OnInit {

  // Var Camera
  public imgDenuncia = '../../assets/img/vetor.png';

  public dataDenuncia: Date = new Date();
  public horaDenuncia: Date = new Date();
  public localDenuncia: any;
  public infoDenuncia;
  public local: any;

  //Variaveis do mapa
  L: any = null;
  mostraMapa: boolean = false;



  map2: Map = null;
  lat: any;
  long: any;
  latLngC: any;
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
    public db: AngularFirestore,
    public modalController: ModalController) { }

  ngOnInit() {
  }

  /** Load leaflet map **/
  leafletMap() {
    this.mostraMapa = true;
    console.log('Mostrando mapa')
    if (this.map2 !== 'undefined' && this.map2 !== null) {
      this.map2.remove();
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;

        this.map2 = new Map('mapId2').setView([this.lat, this.long], 18);
        this.map2.on('click', (e) => { this.mapMarker(e); });

        tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map2);

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  }

  mapRemove() {
    //this.map2.remove(); -> Isso tava fazendo dar um erro bem grande
    this.returnHome();
  }

  mapMarker(e) {
    console.log("Objeto: ", e);
    console.log("Latlng: ", e.latlng);
    console.log("Lat: ", e.latlng.lat);
    console.log("Lng: ", e.latlng.lng);
    if (this.L !== null) {
      this.map2.removeLayer(this.L);
    }
    this.L = marker(e.latlng)
    this.L.addTo(this.map2).bindPopup('Você selecionou esse ponto').openPopup();
    this.local = e.latlng;

    this.localAtual('Local selecionado')
  }

  localAtual(endereco) {
    this.localDenuncia = endereco;
  }

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

  // ENVIAR DENUNCIA
  subDenuncia() {
    if (this.dataDenuncia === undefined || this.horaDenuncia === undefined ||
      this.infoDenuncia === undefined || this.localDenuncia === undefined) {
      this.alertas.presentToast('Preencha os campos!');
    } else {
      const dados = {
        dataDenuncia: this.dataDenuncia,
        horaDenuncia: this.horaDenuncia,
        localDenuncia: this.localDenuncia,
        infoDenuncia: this.infoDenuncia,
        local: new firebase.firestore.GeoPoint(this.local.lat, this.local.lng)
      };
      console.log(dados)
      this.alertas.presentAlert('Tem certeza do que está enviando?', dados, 'denuncias')
      // COLOCA AQUI para envia dados da denuncia ao banco
      // Falta enviar a foto
      // E como tranformar o local no nome da rua
    }

  }

  Fiscal() {
    return AppModule.getUsuarioStatus();
    console.log(AppModule.getUsuarioStatus())
  }
}