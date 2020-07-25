import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
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

@Component({
  selector: 'app-editar-ambulante',
  templateUrl: './editar-ambulante.page.html',
  styleUrls: ['./editar-ambulante.page.scss'],
})
export class EditarAmbulantePage implements OnInit {

  public imgPessoa: string;
  public ambulante: any;

  trabalho: boolean = true;
  informacoes: boolean = false;
  horario: boolean = false;
  atividade: boolean = false;
  equipamento: boolean;
  private url_banco = 'http://localhost/orditiServices/atualizarAmbulante.php';

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public camera: Camera,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    public modalController: ModalController,
    public router: Router,
    public webView: WebView,
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
    console.log(this.ambulante);
  }

  Editar() {
    //this.db.collection('ambulantes').doc(this.ambulante.cpf).set(this.ambulante);
  }

  alterarDados(){
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
            await this.sqlOrditi.enviarDados(dados, url, alerta);
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
}
