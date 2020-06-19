import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Router } from '@angular/router';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';

import { AlertasService } from '../services/alertas.service';
import { AngularFirestore } from '@angular/fire/firestore';

import * as L from 'leaflet';

import { AppModule } from '../app.module';
import { CameraService } from '../services/camera/camera.service';

import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { HttpClient } from '@angular/common/http';

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
  denunciaIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/icon-denuncia.png' });
// L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.page.html',
  styleUrls: ['./denuncia.page.scss'],
})
export class DenunciaPage implements OnInit {

  // Var Camera
  public imgDenuncia = '../../assets/img/vetor.png';

  metadata = {
    contentType: 'image/jpeg',
  };

  public dataDenuncia: Date = new Date();
  public horaDenuncia: Date = new Date();
  public localDenuncia: any;
  public infoDenuncia;
  public local: any;
  public seunome: any;

  public imgAut;

  //Variaveis do mapa
  L: any = null;
  mostraMapa: boolean = false;

  // Necessário para cadastrar no Banco
  private url_banco = 'https://syphan.com.br/orditiServices/cadastrarDenuncia.php';
  private alerta_texto = 'Não foi possível realizar a denuncia!';

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
    private sqlOrditi: SqlOrditiService,
    private geolocation: Geolocation,
    public alertas: AlertasService,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public Cam: Camera,
    public httpClient: HttpClient
  ) {
  }

  remover() {
    this.imgAut = null
  }

  // Função para camera

  // CAMERA
  async cam() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Escolher Imagem',
      buttons: [{
        text: 'Galeria',
        icon: 'images',
        handler: () => {
          this.takePicture(this.Cam.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Capturar',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.Cam.PictureSourceType.CAMERA);

        },

      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {

    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.Cam.DestinationType.DATA_URL,
      encodingType: this.Cam.EncodingType.JPEG,
      mediaType: this.Cam.MediaType.PICTURE,


    }

    this.Cam.getPicture(options).then((imgData) => {

      this.imgAut = 'data:image/jpeg;base64,' + imgData;
    });
  }


  ngOnInit() {
  }

  /** Load leaflet map **/
  leafletMap() {
    this.mostraMapa = true;

    if (this.map2 !== 'undefined' && this.map2 !== null && !this.localDenuncia) {
      this.map2 = null;
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;

        this.map2 = new Map('mapId2').setView([this.lat, this.long], 18);
        this.map2.on('click', (e) => { this.mapMarker(e); });

        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map2);

      }).catch((error) => {

      });
    }
  }


  mapMarker(e) {
    if (this.L !== null) {
      this.map2.removeLayer(this.L);
    }
    this.L = marker(e.latlng, { icon: ambulanteIcon })

    this.L.addTo(this.map2).bindPopup('Você selecionou esse ponto').openPopup();
    this.local = e.latlng;
    this.consultaCoord();
  }





  // DATA DO OCORRIDO
  mudaData(event) {
    this.dataDenuncia = new Date(event.detail.value);


  }
  mudaHora(event) {
    this.horaDenuncia = new Date(event.detail.value);

  }

  // ENVIAR DENUNCIA
  subDenuncia() {
    if (this.dataDenuncia === undefined || this.horaDenuncia === undefined ||
      this.infoDenuncia === undefined || this.local === undefined || this.imgDenuncia === undefined ) {
      this.alertas.presentToast('Preencha os campos!');
    } else {
      if (this.localDenuncia === undefined) {
        this.localDenuncia = " ";
      }
      const dados = {
        'foto': this.imgAut,
        'data_denuncia': this.dataDenuncia,
        'hora_denuncia': this.horaDenuncia,
        'descricao': this.infoDenuncia,
        'latitude': this.local.lat,
        'longitude': this.local.lng,
        'local': this.localDenuncia,
      };


      this.presentAlertDenuncia(dados, this.url_banco, this.alerta_texto);

    }

  }

  Fiscal() {
    return AppModule.getUsuarioStatus();

  }

  async geocoderTesteError(e) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: '' + e,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertDenuncia(dados, url, alerta) {
    var resp: string = ' ';

    const alert = await this.alertController.create({
      header: 'Atenção',
      message: "Deseja registrar essa denuncia?",
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',

        }, {
          text: 'Registrar',
          handler: async () => {
            // ESTA PARTE ENVIA AO WEBSERVICE
            await this.sqlOrditi.enviarDados(dados, url, alerta);
          }
        }
      ]
    });

    await alert.present();
    return resp;

  }



  // FUNÇÕES PARA RETONAR ENDEREÇO
  consultaCoord() {
    let link = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.local.lat},${this.local.lng}&key=AIzaSyATL2xqnX58yMa5CMocNPVm7Zcabd1eFe8`;

    this.httpClient.get(link)

      //viacep.com.br/ws/${cep}/json`)
      .subscribe(response => {
        this.rpNomesLocal(response);

      });
  }

  rpNomesLocal(geoinfo) {
    let endereco = geoinfo.results[0].formatted_address;
    this.localDenuncia = endereco;
  }
}