import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import * as L from 'leaflet';

import { Map, tileLayer, marker } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  public imgCpf: string;
  public imgRg: string;
  public imagem: string;
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
  public produto: any[];
  public pontoRef: string;
  public localAtiv: string;
  public regiao: string;
  public local: any;
  public diasAtend: any;
  public enderecoLocal: any;
  public hInicio: Date;
  public hfim: Date;
  public relatoAtividade: string;
  public dimensao: string;

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

  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos', 'Ornamentos', 'Confecções', 'Calçados', 'Artigos de uso pessoal', 'Louças', 'Ferragens', 'Artefatos de plástico, borracha ou couro', 'Utensílios Domésticos', 'Artesanato e Antiguidades', 'Arte em geral', 'Outros'];

  returnHome() {
    this.router.navigate(['/home']);
  }
  //tipo de dado - Firebase
  metadata = {
    contentType: 'image/jpeg',
  };



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
    public Cam: Camera,

    public httpClient: HttpClient

  ) {

  }

  // CAMERA
  async cam(tipo) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Escolher Imagem',
      buttons: [{
        text: 'Galeria',
        icon: 'images',
        handler: () => {
          this.takePicture(this.Cam.PictureSourceType.PHOTOLIBRARY, tipo);
        }
      },
      {
        text: 'Capturar',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.Cam.PictureSourceType.CAMERA, tipo);

        },

      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType, tipo) {

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

      let imagem = 'data:image/jpeg;base64,' + imgData;

      if (tipo === 1) {
        if (imagem) {
          this.imgDefaultP = null
          this.imgPessoa = imagem;
          imagem = null;
        }
      }

      if (tipo === 3) {
        if (imagem) {
          this.imgCpf = imagem;
          imagem = null;
        }
      }

      if (tipo === 4) {
        if (imagem) {
          this.imgRg = imagem;
          imagem = null;
        }
      }

      else {
        if (imagem) {
          this.imgDefaultL = null
          this.imgProduto = imagem;
          imagem = null;

        }
      }

    })
  }

  // REMOVE IMAGENS MOSTRADAS NA TELA
  remover(tipo) {
    if (tipo === 2) {
      this.imgProduto = null;
    }

    if (tipo === 3) {
      this.imgCpf = null;
    }

    if (tipo === 4) {
      this.imgRg = null;

    }


  }





  //Funcoes para o mapa
  ocultarMapa() {
    this.mostrarMapa = false;
  }


  /** Load leaflet map **/
  leafletMap() {
    this.mostrarMapa = true;
    if (this.map2 !== 'undefined' && this.map2 !== null && !this.enderecoLocal) {
      this.map2 = null;
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

      });
    }
  }

  mapRemove() {
    //this.map2.remove(); -> Isso tava fazendo dar um erro bem grande
    this.returnHome();
  }

  mapMarker(e) {




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

    this.consultaCoord();

  }

  localAtual(endereco) {
    this.localAtiv = endereco;
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
    this.enderecoLocal = endereco;
    endereco = endereco.split(", ");
    var enderecoAux = endereco[1].split("- ");
    endereco[1] = enderecoAux[1];

  }


  consultaCep(cep) {
    let response = this.httpClient.get(
      `//viacep.com.br/ws/${cep}/json`)
      .subscribe(response => {

        this.rpNomesRes(response);

      });

  }
  rpNomesRes(dados) {
    this.rua = dados.logradouro;
    this.bairro = dados.bairro;
    this.cidade = dados.localidade;

  };





  // Botão de Seguinte Etapa
  verifiEtapa(etapa) {


    let condicoes = this.nome === undefined || this.cpf === undefined || this.fone === undefined ||
      this.rg === undefined || this.nomeMaterno === undefined || this.bairro === undefined
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
      this.mostrarMapa = false;
      if (!this.enderecoLocal) {
        this.map2 = null;
      }


    }
  }

  // OBTEM OS HORÁRIOS DE FUNCIONAMENTO
  horaInicio(event) {
    this.hInicio = new Date(event.detail.value);

  }
  // OBTEM OS HORÁRIOS DE FUNCIONAMENTO

  horaFim(event) {
    this.hfim = new Date(event.detail.value);

  }

  // Obtem a imagem a partir do cpf do ambulante
  // Envia pro banco de Dados 
  obterQrCode() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.qrCodeAmbulante = canvas.toDataURL('image/jpeg').toString();

  }

  // Botão de cadastro
  cadastrar() {

    let condicicoes = this.produto === undefined || this.hInicio === undefined
      || this.hfim === undefined || this.relatoAtividade === undefined
      || this.produto === undefined || this.local === undefined
      || this.dimensao === undefined || this.imgProduto === undefined;
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
          'area_equipamento': this.dimensao,
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

  }


}
