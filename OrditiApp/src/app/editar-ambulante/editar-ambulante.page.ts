import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController, ActionSheetController, NavParams } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase'
import { CameraService } from '../services/camera/camera.service';

@Component({
  selector: 'app-editar-ambulante',
  templateUrl: './editar-ambulante.page.html',
  styleUrls: ['./editar-ambulante.page.scss'],
})
export class EditarAmbulantePage implements OnInit {

  public imgPessoa: string;
  public ambulante: any;

  constructor(
    private geolocation: Geolocation,
    public db: AngularFirestore,
    public alertas: AlertasService,
    public camera: Camera,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,    
    public modalController: ModalController,
    public router: Router,
    public webView: WebView,
    public actionSheetController: ActionSheetController,
    public usarCamara: CameraService,
    public navParams: NavParams,
  ) {
    this.ambulante = navParams.get('item');
    }

  ngOnInit() {
    console.log(this.ambulante);
  }

  Editar(){
    this.db.collection('ambulantes').doc(this.ambulante.cpf).set(this.ambulante);
  }
}
