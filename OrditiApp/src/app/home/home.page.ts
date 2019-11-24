import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController, ModalController } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Observable } from 'rxjs';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { AlertasService } from '../services/alertas.service';
import * as L from 'leaflet';

const iconRetinaUrl = '../../assets/leaflet/images/marker-icon-2x.png';
const iconUrl = '../../assets/leaflet/images/marker-icon.png';
const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any = AppModule.getUsuario();

  map: L.map = null;
  lat: any;
  long: any;

  //Zonas da cidade
  locais: any[];
  pracaLions: number = 0;
  pracaSinimbu: number = 0;
  pracaGogoEma: number = 0;
  orlaUrbana: number = 0;

  zona: any = null;

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public alertController: AlertController,
    public db: AngularFirestore,
    public modalCtrl: ModalController) {
  }

  Fiscal() {
    return AppModule.getUsuarioStatus();
    console.log(AppModule.getUsuarioStatus())
  }

  ionViewDidEnter() {
    if (this.map !== 'undefined' && this.map !== null) {
      this.map.remove();
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.map = new Map('mapId').setView([this.lat, this.long], 30);
        tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map);

        /** Criar poligonos a partir de dados do firebase */
        //Código de acesso à coleção das zonas no firebase 
        this.db.collection('zonas').get().toPromise().then(snapshot => {
          snapshot.forEach(doc => {
            this.criarPoligono(doc);
          })
        });

        this.db.collection('ambulantes').get().toPromise().then(snapshot => {
          snapshot.forEach(geo => {
            this.criarMarkerAmbulantes(geo);
          })
        });
        //Fim do acesso ao Firebasse

        /** Criar mapa na posição atual do usuário **/
        const marker = L.marker([this.lat, this.long]).addTo(this.map)
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

  criarMarkerAmbulantes(geo){
    console.log("----------");
    console.log("Lions: ", this.pracaLions);
    console.log("Orla urbana: ", this.orlaUrbana);
    console.log("Gogó da ema: ", this.pracaGogoEma);
    console.log("Sinimbu: ", this.pracaSinimbu);
    console.log("----------");

    var ambulanteFoto = geo.data().foto;
    var ambulanteNome = geo.data().nome;
    var ambulanteProduto = geo.data().produto;
    var ambulanteLat = geo.data().local._lat;
    var ambulantLong = geo.data().local._long;
    var zona = geo.data().zona;

    var amb = L.marker([ambulanteLat, ambulantLong]).bindPopup('<img src="'+ ambulanteFoto +'"><br>'+'Ambulante: <strong>'+ ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();
    amb.addTo(this.map);

    if(zona == "praça lions"){
      this.pracaLions++;
      console.log("Lions att: ", this.pracaLions);
    }else if(zona == "orla urbana"){
      this.orlaUrbana++;
      console.log("Orla urbana att: ", this.orlaUrbana);
    }else if(zona == "praça gogó da ema"){
      this.pracaGogoEma++;
      console.log("Gogó da ema att: ", this.pracaGogoEma);
    }else if(zona == "praça sinimbu"){
      this.pracaSinimbu++;
      console.log("Sinimbu att: ", this.pracaSinimbu);
    } 
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
    this.zona = doc.data()
    console.log(doc.data().nome)
  }

  fecharCard() {
    this.zona = null;
  }


}
