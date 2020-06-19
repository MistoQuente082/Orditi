import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { Observable } from 'rxjs';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase'
import { CameraService } from '../services/camera/camera.service';
import { EditarAmbulantePage } from '../editar-ambulante/editar-ambulante.page';

@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {
  historico: boolean = false;
  trabalho: boolean = true;
  informacoes: boolean = false;

  historicoLista: any[]=[];
  ambulante: any;
  
  // Variaveis da pessoa
  constructor(
    public db: AngularFirestore,
    public alertas: AlertasService,
    public navParam: NavParams,
    public modalController: ModalController,
    public router: Router,
  ) {
    this.ambulante = this.navParam.get('info');
    console.log(this.ambulante);
  }


  async dismiss() {
    await this.modalController.dismiss();
  }
  ngOnInit() { }

  async enviarEditar() {
    const modal = await this.modalController.create({
      component: EditarAmbulantePage,
      componentProps: {
        item: this.ambulante
      }
    });

    await modal.present();
  }

  mostrarNotificacoes(){
    if(this.historico === false){
      this.historico = true;
    }
      else{
        this.historico = false;
      }
  }
  mostrarTrabalho(){
    if(this.trabalho === false){
    this.trabalho = true;
  }
    else{
      this.trabalho = false;
    }
  }

  mostrarInfor(){
    if(this.informacoes === false){
    this.informacoes = true;
  }
    else{
      this.informacoes = false;
    }
  }

}

