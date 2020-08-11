import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { ValidaCadastroService } from '../services/validaCadastro/valida-cadastro.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';


@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.page.html',
  styleUrls: ['./editar-empresa.page.scss'],
})
export class EditarEmpresaPage implements OnInit {
  empresa: any;
  produtoslista: any[] = [];
  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];
  informacoes: boolean;
  atividade: boolean = true;
  trabalho: boolean;

  statusCPF: boolean = true;
  statusCNPJ: boolean = true;
  statusEMAIL: boolean = true;
  statusNUM: boolean = true;

  private url_banco = 'http://localhost/orditiServices/atualizarEmpresa.php';

  


  constructor(
    public navParam: NavParams,
    private modalController: ModalController,
    public validador: ValidaCadastroService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private sqlOrditi: SqlOrditiService,
    public Cam: Camera,
    

  ) {
    this.empresa = this.navParam.get('item');

  }
  alterarDados() {
    console.table(this.empresa);
    this.empresa.produto = this.produtoslista.join('');

    this.presentAlertCadastro(this.empresa, this.url_banco, "Yeetz");
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
            await this.sqlOrditi.enviarDados(dados, url, alerta);
            this.sqlOrditi.ok ? this.dismiss() : '' ;
          }
        }
      ]
    });

    await alert.present();
    return resp;
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
          this.empresa.foto_cliente = null
          this.empresa.foto_cliente = imagem;
          imagem = null;
        }

        if (tipo === 3) {
          this.empresa.foto_cpf = null
          this.empresa.foto_cpf = imagem;
          imagem = null;
        }
        if (tipo === 4) {
          this.empresa.foto_rg = null
          this.empresa.foto_rg = imagem;
          imagem = null;
        }

        if (tipo === 6) {
          this.empresa.foto_cnpj = null
          this.empresa.foto_cnpj = imagem;
          imagem = null;
        }

        if (tipo === 5) {
          this.empresa.foto_contrato_social = null
          this.empresa.foto_contrato_social = imagem;
          imagem = null;
        }
        if (tipo === 7) {
          this.empresa.foto_alvara = null
          this.empresa.foto_alvara = imagem;
          imagem = null;
        } else {
            this.empresa.foto_outro = null
            this.empresa.foto_outro = imagem;
            imagem = null;
        }

      }
    })
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


  mostrarAtividade() {
    if (this.atividade === false) {
      this.atividade = true;


    }
    else {
      this.atividade = false;
    }
  }

  mostrarTrabalho() {
    if (this.trabalho === false) {
      this.trabalho = true;


    }
    else {
      this.trabalho = false;
    }
  }

  mostrarInfor() {
    if (this.informacoes === false) {
      this.informacoes = true;
    }
    else {
      this.informacoes = false;
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    for (let prod of this.empresa.produto) {
      this.produtoslista.push(prod);
    }
  }

}
