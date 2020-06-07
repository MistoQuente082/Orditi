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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  // Var Camera
  public imgPessoa: string;
  public imgProduto: string;
  public imgDefaultP: string = "../../assets/img/avatar.svg";
  public imgDefaultL: string = "../../assets/img/avatar.svg";

  // Variaveis da pessoa
  public nome: string;
  public cpf: string;
  public escolaridade: string;
  public enderecoPessoa: string;
  public fone: string;
  public email: string;

  public cep: string;
  public cidade: string;
  public rua: string;
  public bairro: string;
  public numero: number;
  public nomeMaterno: string;
  public rg: string;



  // QrCode
  public qrCodeAmbulante: string;
  public elementType: 'canvas';



  // Variaveis Do trabalho
  public produto: string;
  public pontoRef: string;
  public localAtiv: string;
  public regiao: string;
  public local: any;
  public diasAtend: any;
  public enderecoLocal: any;
  public hInicio: Date;
  public hfim: Date;
  public relatoAtividade: string;
  //Variaveis do mapa
  L: any = null;


  // Etapas do Cadastro
  private etapaCadastro: number = 1;


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
  imgCpf: string;
  imgRg: string;


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
  }

  consultaCep(cep) {
    let response = this.httpClient.get(
      `//viacep.com.br/ws/${cep}/json`)
      .subscribe(response => {
        console.log('retorna do cep', response);
        this.rpDadosPessoa(response);

      });
    console.log('retorna do cep');

  }

  horaInicio(event) {
    this.hInicio = new Date(event.detail.value);
    console.log('Chegada:', this.hInicio);
  }

  horaFim(event) {
    this.hfim = new Date(event.detail.value);
    console.log('Saida:', this.hfim);
  }



  obtemEnd() {
    let link = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.local.lat},${this.local.lng}&key=AIzaSyATL2xqnX58yMa5CMocNPVm7Zcabd1eFe8`;
    console.log(link);
    this.httpClient.get(link)

      //viacep.com.br/ws/${cep}/json`)
      .subscribe(response => {
        this.obterNomes(response);

      });
  }

  obterNomes(geoinfo) {
    let endereco = geoinfo.results[0].formatted_address;
    this.enderecoLocal = endereco;
    endereco = endereco.split(", ");
    var enderecoAux = endereco[1].split("- ");
    endereco[1] = enderecoAux[1];

  }





  rpDadosPessoa(dados) {
    this.rua = dados.logradouro;
    this.bairro = dados.bairro;
    this.cidade = dados.localidade;

  };




  // Obtem a imagem a partir do cpf do ambulante
  // Envia pro banco de Dados 
  obterQrCode() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.qrCodeAmbulante = canvas.toDataURL('image/jpeg').toString();

  }

  // Chama a câmera
  cam(tipo) {

    this.usarCamera.presentActionSheet();
    if (tipo === 1) {
      if (this.usarCamera.imagem) {
        this.imgDefaultP = null
        this.imgPessoa = this.usarCamera.imagem;
        this.usarCamera.imagem = null;
      }
    }

    if (tipo === 3) {
      if (this.usarCamera.imagem) {
        this.imgCpf = this.usarCamera.imagem;
        this.usarCamera.imagem = null;
      }
    }

    if (tipo === 4) {
      if (this.usarCamera.imagem) {
        this.imgRg = this.usarCamera.imagem;
        this.usarCamera.imagem = null;
      }
    }

    else {
      if (this.usarCamera.imagem) {
        this.imgDefaultL = null
        this.imgProduto = this.usarCamera.imagem;
        this.usarCamera.imagem = null;

      }
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
          attribution: '&copy; <a href="https://www.openenderecomap.org/"></a>', maxZoom: 18
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

    this.obtemEnd();

  }

  localAtual(endereco) {
    this.localAtiv = endereco;
  }


  // Botão de Seguinte Etapa
  verifiEtapa(etapa) {


    let condicoes = this.nome === undefined || this.cpf === undefined || this.fone === undefined ||
      this.rg === undefined || this.nomeMaterno === undefined || this.cep === undefined || this.bairro === undefined
      || this.rua === undefined || this.imgRg === undefined || this.imgCpf === undefined
      || this.cidade === undefined; //this.imgPessoa !== '../../assets/img/avatar.svg';
    if (etapa === 1) {
      if (condicoes) {
        this.alertas.presentToast('Preencha os campos!');
      }

      else {

        this.etapaCadastro = 2;

      }

    } else {
      this.etapaCadastro = 1;
    }
  }

  // Botão de cadastro
  cadastrar() {

    /*
        if (this.regiao !== 'a1') {
          if (this.produto === undefined || this.regiao === undefined) {
            this.alertas.presentToast('Preencha os campos!');
          } else {
            if (this.pontoRef === undefined) {
              this.pontoRef = ' ';
            }
    
            
    
    
            console.log('rg', this.regiao);
            const dados = {
           
              'nome': this.nome,
              'identidade': this.cpf,
              'fone': this.fone,
              'escolaridade': this.escolaridade,
              'endereco': this.enderecoPessoa,
              'pontoRef': this.pontoRef,
              'produto': this.produto,
              'foto': this.imgPessoa,
              'regiao': this.regiao,
              'situacao': 0, // 0: ainda n pagou, 1: pagou 
            };
            this.presentAlertCadastro(dados, this.url_banco, this.alerta_texto);
          }
        } else {
          */
    let condicicoes = this.produto === undefined || this.regiao === undefined ||
      this.hInicio === undefined || this.hfim === undefined || this.relatoAtividade === undefined
      || this.imgProduto === undefined;
    if (condicicoes) {
      this.alertas.presentToast('Preencha os campos ');
    }
    else {
      this.diasAtend = this.diasAtend.toString();
      this.enderecoPessoa = this.rua + ' N° ' + this.numero + ', ' + this.bairro + ', ' + this.cidade;
      this.obterQrCode();

      if (this.localAtiv === undefined) {
        this.localAtiv = " "
        //this.alertas.presentToast('Selecione um ponto no mapa!');
      } else {
        if (this.pontoRef === undefined) {
          this.pontoRef = " "
        }
        var dados = {
          'nome': this.nome,
          'cpf_cnpj': this.cpf,
          'rg': this.rg,
          'fone': this.fone,
          'email': this.email,
          'nome_materno': this.nomeMaterno,
          'endereco': this.enderecoPessoa,
          'end_local': this.enderecoLocal,
          'ponto_referencia': this.pontoRef,
          'produto': this.produto,
          'foto_cliente': this.imgPessoa,
          'latitude': this.local.lat,
          'longitude': this.local.lng,
          'regiao': 0,
          'atendimento_dias': this.diasAtend,
          'atendimento_incio': this.hInicio,
          'atendimento_fim': this.hfim,
          'relato_atividade': this.relatoAtividade,
          'qr_code': this.qrCodeAmbulante,
          'foto_cpf': this.imgCpf,
          'foto_rg': this.imgRg,
          'foto_equipamento': this.imgProduto,
          'situacao': 0, // 0: ainda n pagou, 1: pagou 
        };
        this.presentAlertCadastro(dados, this.url_banco, this.alerta_texto);
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
