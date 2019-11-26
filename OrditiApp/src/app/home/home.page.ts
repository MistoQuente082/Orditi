import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController, ModalController } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Observable } from 'rxjs';
import { DetalheZonaPageModule } from '../detalhe-zona/detalhe-zona.module';
import { AlertasService } from '../services/alertas.service';
import * as L from 'leaflet';
import * as L2 from 'leaflet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

import * as firebase from 'firebase';


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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  count = 0;

  user: any = AppModule.getUsuario();

  map: L.map = null;
  lat: any;
  long: any;

  //Zonas da cidade
  locais: any[];

  zona: any = null;


  //  qrCode
  qrData = 'Hola Mundo';
  scannedCode = null;

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public alertController: AlertController,
    public db: AngularFirestore,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner) {
  }




  LeerCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData;
      console.log(barcodeData.text);
      alert(barcodeData.text);

      this.db.collection('ambulantes').doc(this.scannedCode.text).get().toPromise()
        .then(doc => {
          if (doc.exists) {
            this.irPerfis(doc.data());
            console.log('Entreou');
          } else {
            this.alertas.presentToast('Nenhum usuário com esse código');
            console.log('Não rolou');
          }

        })
        .catch(err => {
          console.log("Error", err);
        });

    });
  }

  Fiscal() {
    return AppModule.getUsuarioStatus();
    console.log(AppModule.getUsuarioStatus());
  }

  ionViewDidEnter() {
    if (this.map !== 'undefined' && this.map !== null) {
      this.map.remove();
    } else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.map = new Map('mapId').setView([this.lat, this.long], 30);
        tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map);

        // var markers = L.markerClusterGroup();

        /** Criar poligonos a partir de dados do firebase */
        //Código de acesso à coleção das zonas no firebase 
        this.db.collection('zonas').get().toPromise().then(snapshot => {
          snapshot.forEach(doc => {
            this.criarPoligono(doc);
          })
        });
        //Criar Pins de Ambulantes
        this.db.collection('ambulantes', ref =>
          ref.where('regiao', '==', 'Independente')
        ).get().toPromise().then(snapshot => {
          snapshot.forEach(geo => {
            this.criarMarkerAmbulantes(geo);
          })
        });
        if (this.Fiscal()) {

          this.db.collection('denuncias').get().toPromise().then(snapshot => {
            snapshot.forEach(den => {
              this.criarMarkerDenuncias(den);
            })
          });
        }
        //Fim do acesso ao Firebasse

        /** Criar mapa na posição atual do usuário **/
        const marker = L.marker([this.lat, this.long], { icon: defaultIcon }).addTo(this.map)
          .bindPopup('Você está aqui!') //Mensagem do ponto
          .openPopup(); //Abre a Mensagem


      }).catch((error) => {
        console.log('Error getting location', error);
        this.geolocationErrorAlert();
      });
    }
  }

  /** Remove map when we have multiple map object **/
  ionViewWillLeave() {
    this.map.remove();
  }

  // retornar local atual
  localAtual() {
    this.map.setView([this.lat, this.long], 30);
  }

  criarMarkerAmbulantes(geo) {

    var ambulanteFoto = geo.data().foto;
    var ambulanteNome = geo.data().nome;
    var ambulanteProduto = geo.data().produto;
    var ambulanteLat = geo.data().local._lat;
    var ambulantLong = geo.data().local._long;
    var zona = geo.data().zona;

    //console.log(ambulanteFoto)
    //firebase.storage().ref().child('ambulantes/' + geo.data().cpf + '.jpg').getDownloadURL().then(url => {
    //  ambulanteFoto = url;
    //});
    console.log(ambulanteFoto);

    var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();
    amb.addTo(this.map);
  }

  criarMarkerDenuncias(den) {
    var denunciaLat = den.data().local._lat;
    var denunciaLong = den.data().local._long;

    var denMarker = L.marker([denunciaLat, denunciaLong], { icon: denunciaIcon }).bindPopup('<strong>Denuncia</strong>').openPopup();
    denMarker.addTo(this.map);
  }

  criarPoligono(doc) {
    var zona = doc.data().coordenadas;
    var area = [];
    //Constrói a matriz area com arrays de coordenadas(latitude e longitude)
    for (var ponto in zona) {
      //Ao usar geopoints do firebase sempre confira se as coordenadas de longitude e latitude estão no lugar certo pq sei lá
      area.push([zona[ponto].latitude, zona[ponto].longitude])
    }
    //Testando
    console.log(area);
    //Constrói um poligono com as coordenadas presentes em 'area'
    var regiao = polygon(area, { color: 'gray', fillColor: '#838b8b' });
    regiao.on('click', (e) => { this.regiaoClicada(doc); });
    //Adiciona o polígono ao mapa com um popup que aparece ao clicar no polígono
    regiao.addTo(this.map);
    regiao.bindPopup(doc.data().nome + ': ' + doc.data().capacidade);
  }

  /** Create an alert when geolocation function fails **/
  async geolocationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Erro',
      subHeader: 'Não foi possível definir a localização',
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostraDetalhes() {
    var zona = this.zona;
    console.log('click')
    const modal = await this.modalCtrl.create({
      component: DetalheZonaPage,
      componentProps: {
        info: zona
      }
    });
    return await modal.present();
    //this.alertas.presentModal(DetalheZonaPage, this.zona);
  }

  regiaoClicada(doc) {
    this.count = 0;
    this.zona = doc.data()
    this.db.collection('ambulantes', ref =>
      ref.where('regiao', '==', this.zona.nome)).get().toPromise().then(snapshot => {
        snapshot.forEach(doc => {
          this.count += 1;
        })
      })
    console.log(doc.data().nome)
  }

  fecharCard() {
    this.zona = null;
  }


  async irPerfis(item) {
    const modal = await this.modalCtrl.create({
      component: PerfilAmbulantePage,
      componentProps: {
        item
      }
    });

    await modal.present();


  }



}
