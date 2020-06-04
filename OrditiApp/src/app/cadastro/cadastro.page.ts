import { Component, OnInit, OnChanges } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import * as L from 'leaflet';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase'
import { CameraService } from '../services/camera/camera.service';

//Configuração dos markers do leaflet
const iconRetinaUrl = '../../assets/leaflet/images/marker-icon-2x.png';
const iconUrl = '../../assets/leaflet/images/marker-icon.png';
const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';

const LeafIcon = L.Icon.extend({
  // iconRetinaUrl,
  // iconUrl,
  options: {
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  }
});

const defaultIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-icon.png' }),
  ambulanteIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-marker-icon.png' }),
  denunciaIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/denuncia-marker-icon.png' });
// L.Marker.prototype.options.icon = iconDefault;


import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  // Var Camera
  public imgPessoa: string;

  // Variaveis da pessoa
  public nome: string;
  public cpf: string;
  public escolaridade: string;
  public endereco: string;
  public fone: string;

  // QrCode
  public qrCodeAmbulante: string;
  public elementType: 'canvas';



  // Variaveis Do trabalho
  public produto: string;
  public pontoRef: string;
  public localAtiv: string;
  public regiao: string;
  public local: any;

  //Variaveis do mapa
  L: any = null;


  // Necessário para cadastrar no Banco
  private url_banco = 'http://syphan.com.br/orditiServices/cadastrarAmbulante.php';
  private alerta_texto = 'Não foi possível realizar a cadastro'

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
  //tipo de dado - Firebase
  metadata = {
    contentType: 'image/jpeg',
  };

  //lista de locais
  locais: Observable<any[]>;

  constructor(
    private geolocation: Geolocation,
    public db: AngularFirestore,
    public alertas: AlertasService,
    private sqlOrditi: SqlOrditiService,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    public modalController: ModalController,
    public router: Router,
    public webView: WebView,
    public actionSheetController: ActionSheetController,
    public usarCamera: CameraService,
    public httpClient: HttpClient

  ) {
    this.locais = db.collection("zonas").valueChanges();
    this.imgPessoa = "../../assets/img/avatar.svg";
  }

  // Obtem a imagem a partir do cpf do ambulante
  // Envia pro banco de Dados 
  obterImg() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/jpeg').toString();
    const formatado = imageData.split(',');
    const resultado = formatado[1]; // Imagem

    console.log('image', resultado);
  }

  // Chama a câmera
  cam() {
    this.usarCamera.presentActionSheet();
    if (this.usarCamera.imgPessoa) {
      this.imgPessoa = this.usarCamera.imgPessoa;
    }
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
        this.map2.on('  click', (e) => { this.mapMarker(e); });

        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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
    this.L = marker(e.latlng, { icon: ambulanteIcon });
    this.L.addTo(this.map2).bindPopup('Você selecionou esse ponto').openPopup();
    this.local = e.latlng;

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(e.latlng.lat, e.latlng.lng, options)
      .then((result: NativeGeocoderResult[]) => {
        this.localAtual("" + result[0].subAdministrativeArea + " " + result[0].subLocality + " " + result[0].thoroughfare);
      })
      .catch((error: any) => {
        this.geocoderTesteError(error);
      });
  }

  localAtual(endereco) {
    this.localAtiv = endereco;
  }



  // Botão de cadastro
  cadastrar() {
    if (this.regiao !== 'a1') {
      if (this.nome === undefined || this.cpf === undefined || this.endereco === undefined
        || this.escolaridade === undefined || this.fone === undefined || this.produto === undefined
        || this.produto === undefined || this.regiao === undefined) {
        this.alertas.presentToast('Preencha os campos!');
      } else {
        if (this.pontoRef === undefined) {
          this.pontoRef = ' ';
        }

        this.obterImg();

        console.log('rg', this.regiao);
        const dados = {
          'nome': this.nome,
          'identidade': this.cpf,
          'fone': this.fone,
          'escolaridade': this.escolaridade,
          'endereco': this.endereco,
          'pontoRef': this.pontoRef,
          'produto': this.produto,
          'foto': this.imgPessoa,
          'regiao': this.regiao,
          'situacao': 0, // 0: ainda n pagou, 1: pagou 
        };
        this.presentAlertCadastro(dados, this.url_banco, this.alerta_texto);
      }
    } else {
      let condicicoes = this.nome === undefined || this.cpf === undefined || this.endereco === undefined
        || this.escolaridade === undefined || this.fone === undefined || this.produto === undefined
        || this.produto === undefined || this.regiao === undefined || this.imgPessoa === undefined;
      if (condicicoes) {
        this.alertas.presentToast('Preencha os campos e escolha uma imagem!');
      }
      else {
        if (this.localAtiv === undefined) {
          this.localAtiv = " "
          //this.alertas.presentToast('Selecione um ponto no mapa!');
        } else {
          if (this.pontoRef === undefined) {
            this.pontoRef = " "
          }
          var dados = {
            'nome': this.nome,
            'identidade': this.cpf,
            'fone': this.fone,
            'escolaridade': this.escolaridade,
            'endereco': this.endereco,
            'ponto_referencia': this.pontoRef,
            'produto': this.produto,
            'foto': this.imgPessoa,
            'latitude': this.local.lat,
            'longitude': this.local.lng,
            'regiao': "Independente",
            'situacao': 0, // 0: ainda n pagou, 1: pagou 
          };
          this.presentAlertCadastro(dados, this.url_banco, this.alerta_texto);
        }
      }
    }
  }

  ngOnInit() {

  }

  async geocoderTesteError(e) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: '' + e,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Pergunta se realmente deja enviar o pedido de cadastro
  async presentAlertCadastro(dados, url, alerta) {
    var resp: string = ' ';

    const alert = await this.alertController.create({
      header: 'Atenção',
      message: "Deseja adicionar essa pessoa?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        }, {
          text: 'Adicionar',
          handler: async () => {
            // ESTA PARTE ENVIA AO WEBSERVICE
            await this.sqlOrditi.enviarDados(dados, url, alerta);

          }
        }
      ]
    });

    await alert.present();
    return resp;
    console.log(resp);
  }


}
