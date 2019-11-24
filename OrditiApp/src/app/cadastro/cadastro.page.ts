import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase'


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
  public regiao: string;
  public local: any;

  //Variaveis do mapa
  L: any = null;

  mostrarMapa: boolean = false;



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

  //lista de locais
  locais: Observable<any[]>;

  constructor(
    private geolocation: Geolocation,
    public db: AngularFirestore,
    public alertas: AlertasService,
    public camera: Camera,
    public modalController: ModalController,
    public router: Router,
  ) {
    this.locais = db.collection("zonas").valueChanges();
  }
  //Funcoes para o mapa

  /** Load leaflet map **/
  leafletMap() {
    this.mostrarMapa = true;
    if (this.map2 !== 'undefined' && this.map2 !== null) {
      this.map2.remove();
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;

        this.map2 = new Map('mapId3').setView([this.lat, this.long], 18);
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

    this.localAtual('Selecionado')
  }

  localAtual(endereco) {
    this.localAtiv = endereco;
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
      this.imgPessoa = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  // Botão de cadastro
  cadastrar() {
    if (this.regiao !== 'a1') {
      if (this.nome === undefined || this.cpf === undefined || this.endereco === undefined
        || this.escolaridade === undefined || this.fone === undefined || this.produto === undefined
        || this.produto === undefined || this.localAtiv === undefined) {
        this.alertas.presentToast('Preencha os campos!');
      } else {
        if (this.pontoRef === undefined) {
          this.pontoRef = " "
        }
        const dados = {
          data: this.imgPessoa,
          nome: this.nome,
          cpf: this.cpf,
          fone: this.fone,
          escolaridade: this.escolaridade,
          endereco: this.endereco,
          pontoRef: this.pontoRef,
          produto: this.produto,
          localAtiv: this.localAtiv,
          zona: this.regiao,
        };
        this.alertas.presentAlert('Deseja adicionar esta pessoa?', dados, 'ambulantes');
      }
    } else {
      if (this.nome === undefined || this.cpf === undefined || this.endereco === undefined
        || this.escolaridade === undefined || this.fone === undefined || this.produto === undefined
        || this.produto === undefined || this.regiao === undefined) {
        this.alertas.presentToast('Preencha os campos!');
      }
      else {
        if (this.localAtiv === undefined) {
          this.alertas.presentToast('Confirme o local!');
        } else {
          if (this.pontoRef === undefined) {
            this.pontoRef = " "
          }
          const dados = {
            nome: this.nome,
            cpf: this.cpf,
            fone: this.fone,
            escolaridade: this.escolaridade,
            endereco: this.endereco,
            pontoRef: this.pontoRef,
            produto: this.produto,
            localAtiv: this.localAtiv,
            local: new firebase.firestore.GeoPoint(this.local.lat, this.local.lng),
            regiao: "Independente"
          };
          this.alertas.presentAlert('Deseja adicionar esta pessoa?', dados, 'ambulantes');
        }
      }
    }


  }

  ngOnInit() {
  }

}
