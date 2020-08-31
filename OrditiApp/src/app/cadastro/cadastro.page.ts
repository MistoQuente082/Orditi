import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ModalController, ActionSheetController, NavParams } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import * as L from 'leaflet';

import { Map, tileLayer, marker, polygon } from 'leaflet';
import { Router, ActivatedRoute } from '@angular/router';

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

const ambulanteIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-0.png' }),
  ambulanteVerdeIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-1.png' }),
  ambulanteVermelhoIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-2.png' });
// L.Marker.prototype.options.icon = iconDefault;


import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { ValidaCadastroService } from '../services/validaCadastro/valida-cadastro.service';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';




@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  public tipoCadastro: any = '1';

  // Var Camera
  public imgPessoa: string;
  public imgProduto: string;
  public imgCpf: string;
  public imgRg: string;
  public imgCNPJ: string;
  public imgCS: string;
  public imgAlvara: string;
  public imgOutro: string;
  public imagem: string;

  public imgDefaultP: string = "../../assets/img/avatar.png";
  public imgDefaultL: string = "../../assets/img/avatar.png";

  //CNPJ
  public cnpj: string;
  public cmc: string;
  public nomeFantasia: string;
  public foneEmpresa: string;
  public outroProduto: string;
  public tipoEquipamento: string;
  public qtdEquipamento: number;
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
  //public qrCodeAmbulante: string;
  //public elementType: 'canvas';



  // Variaveis Do trabalho
  public produto: any[];
  public pontoRef: string;
  public localAtiv: string;
  public regiao: string;
  public local: any;
  public diasAtend: any[];
  public enderecoLocal: any;
  public hInicio: Date;
  public hfim: Date;
  public relatoAtividade: string;
  public dimensao: string;
  public compr: number;
  public larg: number;
  public zona: any;


  //Variaveis do mapa
  L: any = null;


  // Etapas do CadastroN
  private etapaCadastro: number = 1;

  // Necessário para cadastrar no Banco
  private url_banco = 'http://localhost/orditiServices/teste.php';
  private url_banco_PJ = 'http://localhost/orditiServices/cadastrarEmpresa.php';

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

  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];

  statusCPF: boolean = true;
  statusCNPJ: boolean = true;
  statusEMAIL: boolean = true;
  statusNUM: boolean = true;
  cadastroFuncionario: boolean = false;
  idEmpresa: any;
  valoresEmpresa: any;

  zonas: any[];
  isPoli: boolean = false;

  
  //tipo de dado - Firebase
  metadata = {
    contentType: 'image/jpeg',
  };

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    private sqlOrditi: SqlOrditiService,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    public modalController: ModalController,
    public router: Router,
    public webView: WebView,
    public actionSheetController: ActionSheetController,
    public validador: ValidaCadastroService,
    public Cam: Camera,
    public httpClient: HttpClient,
    public dadosEmpresa: ListaAmbulantesService

  ) {

  }

  returnHome() {
    this.router.navigate(['/home']);
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

      if (tipo === 5) {
        if (imagem) {
          this.imgCS = imagem;
          imagem = null;
        }
      }

      if (tipo === 6) {
        if (imagem) {
          this.imgCNPJ = imagem;
          imagem = null;
        }
      }

      if (tipo === 7) {
        if (imagem) {
          this.imgAlvara = imagem;
          imagem = null;
        }
      }

      if (tipo === 8) {
        if (imagem) {
          this.imgOutro = imagem;
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
      this.imgProduto = undefined;
    }

    if (tipo === 3) {
      this.imgCpf = undefined;
    }

    if (tipo === 4) {
      this.imgRg = undefined;

    }

    if (tipo === 5) {
      this.imgCS = undefined;
    }
    if (tipo === 6) {
      this.imgCNPJ = undefined;

    }


    if (tipo === 7) {
      this.imgAlvara = undefined;
    }

    else {
      this.imgOutro = undefined;
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

        tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=C1vu4LOmp14JjyXqidSlK8rjeSlLK1W59o1GAfoHVOpuc6YB8FSNyOyHdoz7QIk6', {
          attribution: '', maxZoom: 18
        }).addTo(this.map2);

        this.sqlOrditi.receberDados('https://localhost/orditiServices/listarZonas.php').subscribe(data => {
          console.log(data)
          data.forEach(element => {
            this.criarPoligono(element);
          });
        }, error => {
          console.log(error);
        });

      }).catch((error) => {

      });
    }

    this.sqlOrditi.receberDados('https://localhost/orditiServices/listarZonas.php').subscribe(data => {
          console.log(data)
          data.forEach(element => {
            this.criarPoligono(element);
          });
        }, error => {
          console.log(error);
        });;
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
    if(this.isPoli == false){
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
    this.zona = 0;
  } else {
      this.isPoli = false;
    }

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


  valida(info, tipo) {

    if (tipo === 'cpf') {
      info = info.replace(/\D+/g, '');

      console.log(info);

      this.statusCPF = this.validador.validaCPF(info);


    }

    else if (tipo === 'cnpj') {
      info = info.replace(/\D+/g, '');

      this.statusCNPJ = this.validador.validaCNPJ(info);
      console.log('cnpj', this.statusCNPJ);
    }


    else if (tipo === 'email') {
      this.statusEMAIL = this.validador.validaEMAIL(info);
    }

    else {
      this.statusNUM = this.validador.validaNUM(info);

    }

  }


  // Botão de Seguinte Etapa
  verifiEtapa(etapa, tipoCadastro) {


    const condPJ = this.nome === undefined || this.nomeMaterno === undefined || this.cpf === undefined || this.fone === undefined ||
      this.rg === undefined || this.bairro === undefined || this.cnpj === undefined || this.cmc === undefined
      || this.nomeFantasia === undefined || this.foneEmpresa === undefined || this.cnpj === undefined
      || this.rua === undefined
      || this.cidade === undefined || this.imgPessoa === undefined
      ;

    let condicoes = this.nome === undefined || this.cpf === undefined || this.fone === undefined ||
      this.rg === undefined || this.nomeMaterno === undefined || this.bairro === undefined
      || this.rua === undefined || this.imgRg === undefined || this.imgCpf === undefined
      || this.cidade === undefined || this.imgPessoa === undefined;

    let status = this.statusCPF === false || this.statusCNPJ === false
      || this.statusEMAIL === false || this.statusNUM === false;

    if (status) {
      this.alertas.presentToast('Dados invalidos!');

    }
    else if (etapa === 1) {
      if ((condicoes && tipoCadastro === '1') || (condPJ && tipoCadastro === '2')) {
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
    console.log('hi', this.hInicio);
  }
  // OBTEM OS HORÁRIOS DE FUNCIONAMENTO

  horaFim(event) {
    this.hfim = new Date(event.detail.value);
    console.log('hi', this.hfim);
  }

  // Botão de cadastro
  cadastrar() {
    let produto = this.produto.join('');



    const condPJ = this.imgCpf === undefined || this.imgRg === undefined || this.imgCNPJ === undefined ||
      this.imgCS === undefined || this.imgAlvara === undefined || this.produto === undefined ||
      this.relatoAtividade === undefined || this.qtdEquipamento === undefined
    let condicoes = this.produto === undefined || this.hInicio === undefined
      || this.hfim === undefined
      || this.local === undefined
      || this.compr === undefined
      || this.larg === undefined
      || this.imgProduto === undefined
      || this.imgPessoa === undefined;

    if ((condicoes && produto === '7' && this.relatoAtividade === undefined && this.tipoCadastro === '1')
      || (condPJ && this.tipoCadastro === '2') || (condicoes && this.tipoCadastro === '1')) {
      this.alertas.presentToast('Preencha os campos ');
    }
    else {
      if (this.tipoCadastro === '2') {
        console.log('entreeeeeeo')
        if (this.outroProduto === undefined) {
          this.outroProduto = null;
        }

        var dadosPJ = {
          'nome': this.nome,
          'cpf': this.cpf,
          'rg': this.rg,
          'fone': this.fone,
          'email': this.email,
          'nome_materno': this.nomeMaterno,
          'endereco': this.rua,
          'numero': this.numero,
          'bairro': this.bairro,
          'cidade': this.cidade,
          'cep': this.cep,
          'foto_cliente': this.imgPessoa,
          'foto_cpf': this.imgCpf,
          'foto_rg': this.imgRg,
          'foto_cnpj': this.imgCNPJ,
          'foto_contrato_social': this.imgCS,
          'foto_alvara': this.imgAlvara,
          'foto_outro': this.imgOutro,
          'produto': produto,
          'relato_atividade': this.relatoAtividade,
          'cnpj': this.cnpj,
          'cmc': this.cmc,
          'nome_fantasia': this.nomeFantasia,
          'fone_empresa': this.foneEmpresa,
          'outro_produto': this.outroProduto,
          'quantidade_equipamentos': this.qtdEquipamento,
        }

        console.table(dadosPJ);
        this.presentAlertCadastro(dadosPJ, this.url_banco_PJ, this.alerta_texto);

      } else {

        var atenDias = this.diasAtend.join('');

        if (this.localAtiv === undefined) {
          this.localAtiv = " "
          //this.alertas.presentToast('Selecione um ponto no mapa!');
        } else {
          if (this.pontoRef === undefined) {
            this.pontoRef = " "
          }

          if (this.relatoAtividade === undefined) {
            this.relatoAtividade = null;
          }

          let novoContadorAmbulante = null;
          this.idEmpresa = null;

          if(this.valoresEmpresa){
            this.idEmpresa = this.valoresEmpresa.idEmpresa;
            novoContadorAmbulante = this.valoresEmpresa.contador
          }

          var dados = {
            'contador_ambulante': novoContadorAmbulante,
            'id_empresa': this.idEmpresa,
            'nome': this.nome,
            'identidade': this.cpf,
            'rg': this.rg,
            'fone': this.fone,
            'email': this.email,
            'nome_materno': this.nomeMaterno,
            'endereco': this.rua,
            'numero': this.numero,
            'bairro': this.bairro,
            'cidade': this.cidade,
            'cep': this.cep,
            'end_local': this.enderecoLocal,
            'ponto_referencia': this.pontoRef,
            'produto': produto,
            'foto_cliente': this.imgPessoa,
            'latitude': this.local.lat,
            'longitude': this.local.lng,
            'regiao': this.zona,
            'atendimento_dias': atenDias,
            'atendimento_inicio': this.hInicio,
            'atendimento_fim': this.hfim,
            'relato_atividade': this.relatoAtividade,
            'foto_cpf': this.imgCpf,
            'foto_rg': this.imgRg,
            'foto_equipamento': this.imgProduto,
            'comprimento': this.compr,
            'largura': this.larg,
            'situacao': 0, // 0: ainda n pagou, 1: pagou 
            'tipo_equipamento': this.tipoEquipamento
          };
          console.log(dados);
          this.presentAlertCadastro(dados, this.url_banco, this.alerta_texto);
        }
      }
    }

  }

  ngOnInit() {
    this.valoresEmpresa = this.dadosEmpresa.dadosEmpresa;
    this.dadosEmpresa.dadosEmpresa = null;
    console.log('valores empresa ', this.valoresEmpresa);

    this.sqlOrditi.receberDados('https://localhost/orditiServices/listarZonas.php').subscribe(data => {
      this.zonas = data;
    }, error => {
      console.log(error);
    });;


  }

  criarPoligono(doc) {
    var coordenadas = doc['centroide']
    var area = [coordenadas[1], coordenadas[0]];
    //Constrói a matriz area com arrays de coordenadas(latitude e longitude)
    var zona = doc['poligono'];
    var arealist = []
    for (var ponto in zona) {
      var a = zona[ponto]
      arealist.push([a[1], a[0]])
    }
    //Constrói um poligono com as coordenadas presentes em 'area'
    var regiao = polygon(arealist, { color: '#f5a42c', fillColor: '#f5a42c'  }).on('click', (e) => { this.regiaoClicada(doc); });

    var markerArea = L.marker(area, { icon: ambulanteIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
    if(doc['quantidade_ambulantes']<=49/100*doc['limite_ambulantes']){
      markerArea = L.marker(area, { icon: ambulanteVerdeIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
      regiao = polygon(arealist, { color: '#5ea9a4', fillColor: '#5ea9a4'}).on('click', (e) => { this.regiaoClicada(doc); });
    } else if(doc['quantidade_ambulantes']>=99/100*doc['limite_ambulantes']){
      markerArea = L.marker(area, { icon: ambulanteVermelhoIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
      regiao = polygon(arealist, { color: '#ed2e54', fillColor: '#ed2e54' }).on('click', (e) => { this.regiaoClicada(doc); });
    }
    markerArea.addTo(this.map2);
    regiao.addTo(this.map2);
    console.log("yeetz")
  }

  regiaoClicada(doc){
    this.zona = doc.nome;
    console.log(doc);
    this.enderecoLocal = doc.nome;
    this.isPoli = true;
    this.zona = doc.id;
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
            await this.sqlOrditi.enviarDados(dados, url, alerta, '/home');
          }
        }
      ]
    });

    await alert.present();
    return resp;

  }

}
