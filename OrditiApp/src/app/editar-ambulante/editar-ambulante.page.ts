import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ModalController, ActionSheetController, NavParams } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { Observable } from 'rxjs';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CameraService } from '../services/camera/camera.service';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { ValidaCadastroService } from '../services/validaCadastro/valida-cadastro.service';

@Component({
  selector: 'app-editar-ambulante',
  templateUrl: './editar-ambulante.page.html',
  styleUrls: ['./editar-ambulante.page.scss'],
})
export class EditarAmbulantePage implements OnInit {

  public imgPessoa: string;
  public ambulante: any;

  public imgProduto: string;
  public imgCpf: string;
  public imgRg: string;
  public imgCNPJ: string;
  public imgCS: string;
  public imgAlvara: string;
  public imgOutro: string;
  public imagem: string;

  public imgDefaultL: string = "../../assets/img/avatar.png";

  trabalho: boolean = true;
  informacoes: boolean = true;
  horario: boolean = false;
  atividade: boolean = false;
  equipamento: boolean;
  private url_banco = 'http://localhost/orditiServices/atualizarAmbulante.php';

  produtoslista: any[] = [];
  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];
  diaslista: any[] = [];
  public hInicio: any;
  public hFim: any;
  dimensoes: any[];

  statusCPF: boolean = true;
  statusCNPJ: boolean = true;
  statusEMAIL: boolean = true;
  statusNUM: boolean = true;

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public Cam: Camera,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    public modalController: ModalController,
    public router: Router,
    public webView: WebView,
    public validador: ValidaCadastroService,

    public actionSheetController: ActionSheetController,
    public usarCamara: CameraService,
    private sqlOrditi: SqlOrditiService,
    public navParam: NavParams
  ) {
    this.ambulante = this.navParam.get('item');

    console.log(this.ambulante);
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    for (let prod of this.ambulante.produto) {
      this.produtoslista.push(prod);
    }
    for (let dia of this.ambulante.atendimento_dias) {
      this.diaslista.push(dia);
    }

    this.dimensoes = this.ambulante.area_equipamento.split(" x ");
  }

  Editar() {
    //this.db.collection('ambulantes').doc(this.ambulante.cpf).set(this.ambulante);
  }


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


  alterarDados() {
    this.ambulante.produto = this.produtoslista.join('');
    this.ambulante.atendimento_dias = this.diaslista.join('');
    this.ambulante.area_equipamento = this.dimensoes.join(' x ');

    this.presentAlertCadastro(this.ambulante, this.url_banco, "Yeetz");
  }

  async presentAlertCadastro(dados, url, alerta) {
    var resp: string = ' ';
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: "Deseja alterar essa pessoa?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Adicionar',
          handler: async () => {
            // ESTA PARTE ENVIA AO WEBSERVICE
            await this.sqlOrditi.enviarDados(dados, url, alerta, undefined);
          }
        }
      ]
    });

    await alert.present();
    return resp;
  }

  mostrarInfor() {
    if (this.informacoes === false) {
      this.informacoes = true;
    }
    else {
      this.informacoes = false;
    }
  }

  mostrarHorario() {
    if (this.horario === false) {
      this.horario = true;
    }
    else {
      this.horario = false;
    }
  }

  mostrarAtividade() {
    if (this.atividade === false) {
      this.atividade = true;
    }
    else {
      this.atividade = false;
    }
  }

  mostrarEquipamento() {
    if (this.equipamento === false) {
      this.equipamento = true;
    }
    else {
      this.equipamento = false;
    }
  }

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

    console.log(tipo);

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
      if (imagem) {
        console.log('entrou');
        if (tipo === 1) {
          this.ambulante.foto = null
          this.ambulante.foto = imagem;
          imagem = null;
        }
        if (tipo === 2) {
          this.ambulante.foto_equipamento = null
          this.ambulante.foto_equipamento = imagem;
          imagem = null;
        }
        if (tipo === 3) {
          this.ambulante.foto_cpf = null
          this.ambulante.foto_cpf = imagem;
          imagem = null;
        }
        if (tipo === 4) {
          this.ambulante.foto_rg = null
          this.ambulante.foto_rg = imagem;
          imagem = null;
        }
      }
    })
  }
}
