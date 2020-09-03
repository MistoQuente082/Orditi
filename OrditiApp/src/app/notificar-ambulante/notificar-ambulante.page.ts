import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, NavParams } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { LoginBancoService } from '../services/login/login-banco.service';
import { AlertasService } from '../services/alertas.service';


@Component({
  selector: 'app-notificar-ambulante',
  templateUrl: './notificar-ambulante.page.html',
  styleUrls: ['./notificar-ambulante.page.scss'],
})
export class NotificarAmbulantePage implements OnInit {
  //Informações do banco de dados
  private url_banco = 'https://www.maceio.orditi.com/services/cadastrarNotificacao.php';
  private alerta_texto = 'Não foi possível cadastrar a ocorrência!';
  
  //public imgAut;
  
  public data: Date = new Date();
  public hora: Date = new Date();
  public info;
  public seunome: any;
  
  public id;
  public titulo: any;
  multa: any = null;
  bloquearAmbulante: boolean = false;
  

  constructor(
    private sqlOrditi: SqlOrditiService,
    public alertController: AlertController,
    public modalController: ModalController,
    public navParam: NavParams,
    public alertas: AlertasService,
    public Cam: Camera,
    public loginBanco: LoginBancoService,
    public actionSheetController: ActionSheetController,
    
  ) {
    this.id = this.navParam.get('id');
    this.loginBanco.recuperar('fiscal')
      .then((dados) => {
        console.log(dados);
      })
  }

  ngOnInit() {
  }

  async dismiss() {
    await this.modalController.dismiss();
  }



  // DATA DO OCORRIDO
  mudaData(event) {
    this.data = new Date(event.detail.value);
  }
  mudaHora(event) {
    this.hora = new Date(event.detail.value);
  }

  //Enviar
  submit() {

    let condicoes = this.data === undefined || this.hora === undefined
    || this.titulo === undefined || this.info === undefined;

    if (condicoes) {
      this.alertas.presentToast('Preencha os campos');
    } else {


      this.loginBanco.recuperar('fiscal').then((dados) => {
        const data = {
          'ambulante_id': this.id,
          'data_notificacao': this.data,
          'hora_notificacao': this.hora,
          'descricao': this.info,
          'fiscal_id': dados['id'],
          'fiscal_nome': dados['nome'],
          'titulo': this.titulo,
          'multa': this.multa
          //'bloquear_ambulante': this.bloquearAmbulante
        };
        console.log('data notifi', data)
        this.presentAlertDenuncia(data, this.url_banco, this.alerta_texto);
      })
    }
  }

  async presentAlertDenuncia(dados, url, alerta) {
    var resp: string = ' ';
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: "Deseja registrar essa ocorrência?",
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',

        }, {
          text: 'Registrar',
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

}
