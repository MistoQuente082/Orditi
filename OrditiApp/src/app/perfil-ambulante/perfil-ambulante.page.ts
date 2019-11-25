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

  ambulante: any;
  // Variaveis da pessoa
  constructor(
    public db: AngularFirestore,
    public alertas: AlertasService,
    public modalController: ModalController,
    public NavParam: NavParams,
    public router: Router,
  ) {
    // this.ambulante = NavParams.get('item');
  }
  ngOnInit() {}

  enviarEditar(){
  var perfil = PerfilAmbulantePage;
  this.modalController.create(
    {
      component: EditarAmbulantePage,
      componentProps: {
        perfil: "perfil"
      }
    }).then((modalElement) => {
      modalElement.present();
    });
    this.router.navigate["/editar-ambulante"]
  }
}

