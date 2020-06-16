import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Observable } from 'rxjs';

import { AlertasService } from '../services/alertas.service';
import * as L from 'leaflet';
import * as L2 from 'leaflet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

import * as firebase from 'firebase';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import * as moment from 'moment';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { LoginBancoService } from '../services/login/login-banco.service';
import { thistle } from 'color-name';



const iconRetinaUrl = '../../assets/leaflet/images/marker-icon-2x.png';
const iconUrl = '../../assets/leaflet/images/marker-icon.png';
const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';

const LeafIcon = L.Icon.extend({
  // iconRetinaUrl,
  // iconUrl,
  options: {
    shadowUrl,
    iconSize: [25, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
  }
});

const LeafIconZone = L.Icon.extend({
  options: {
    shadowUrl,
    iconSize: [31, 40],
    shadowSize: [41, 41],
    iconAnchor: [15, 41],
    shadowAnchor: [13, 41],
    popupAnchor: [0, -41]
  }
});

const defaultIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-icon.png' }),
  ambulanteIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-amarelo2.png' }),
  ambulanteVerdeIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-verde.png' }),
  ambulanteVermelhoIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-vermelho.png' }),
  denunciaIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/icon-denuncia.png' }),
  areaIcon = new LeafIconZone({ iconUrl: '../../assets/leaflet/images/marker.png' })

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

  poli: any = polygon( [], {});


  //  qrCode
  qrData = 'Hola Mundo';
  scannedCode = null;

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  constructor(
    private sqlOrditi: SqlOrditiService,
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public alertController: AlertController,
    public db: AngularFirestore,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private loginBanco: LoginBancoService,
  ) {
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
    return this.loginBanco.res_usuario;

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
        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map);

        this.poli.addTo(this.map);

        //Criar Pins de Ambulantes
        this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarAmbulantes.php').subscribe(data => {
          data.forEach(element => {
            this.criarMarkerAmbulantes(element);
            console.log(element);
          });
        }, error => {
          console.log(error);
        });;

        //Criar Pind de Zonas
        this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarZonas.php').subscribe(data => {
          console.log(data)
          data.forEach(element => {
            this.criarPoligono(element);
          });
        }, error => {
          console.log(error);
        });; 
        
        //Adicionar condição para só mostrar se for fiscal
        if (this.Fiscal() !== false) {
          this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarDenuncias.php').subscribe(data => {
            data.forEach(element => {
              console.log(element);
              this.criarMarkerDenuncias(element);
            });
          }, error => {
            console.log(error);
          });;

        }
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

    var ambulanteFoto = geo['foto'];
    var ambulanteNome = geo['nome'];
    var ambulanteProduto = geo['produto'];
    var ambulanteLat = geo['latitude'];
    var ambulantLong = geo['longitude'];
    var ambulanteStatus = geo['situacao'];

    //console.log(ambulanteFoto)
    //firebase.storage().ref().child('ambulantes/' + geo.data().cpf + '.jpg').getDownloadURL().then(url => {
    //  ambulanteFoto = url;
    //});
    if (ambulanteStatus === 1){
    var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVerdeIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();}
    if (ambulanteStatus === 2){
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVermelhoIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();}
    amb.addTo(this.map);
  }

  criarMarkerDenuncias(den) {
    console.log(den);
    var denunciaLat = den['latitude'];
    var denunciaLong = den['longitude'];
    var denunciaInfo = den['descricao'];
    var denunciaData = moment(den.dataDenuncia).format('DD/MM/YYYY');
    var denMarker = L.marker([denunciaLat, denunciaLong], { icon: denunciaIcon }).bindPopup('<strong>Denuncia feita<br>' + denunciaData + '<br> Diz: ' + denunciaInfo + '</strong>').openPopup();
    denMarker.addTo(this.map);
  }

  criarPoligono(doc) {
    var coordenadas = doc['centroide']

    //Constrói a matriz area com arrays de coordenadas(latitude e longitude)
    var markerArea = L.marker(coordenadas, { icon: areaIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
    markerArea.addTo(this.map);
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
    var zona = doc['poligono'];
    var area =[]

    for (var ponto in zona) {
      //Ao usar geopoints do firebase sempre confira se as coordenadas de longitude e latitude estão no lugar certo pq sei lá
      area.push(zona[ponto])
    }

    JSON.stringify(doc);
    this.zona = doc;
    console.log(doc);

    //Constrói um poligono com as coordenadas presentes em 'area'
    var regiao = polygon(area, { color: 'gray', fillColor: '#838b8b' });
    //regiao.on('click', (e) => { this.regiaoClicada(doc); });
    //Adiciona o polígono ao mapa com um popup que aparece ao clicar no polígono
    this.poli.setStyle({opacity: 0.0})
    this.poli = regiao;
    this.poli.addTo(this.map);
    this.poli.bindPopup(doc['nome'] + ': ' + doc['limite_ambulante']);
  }

  fecharCard() {
    this.poli.setStyle({opacity: 0.0})
    this.zona = null;
  }


  async irPerfis(item) {
    const modal = await this.modalCtrl.create({
      component: PerfilAmbulantePage,
      componentProps: {
        info: item
      }
    });

    await modal.present();


  }



}
