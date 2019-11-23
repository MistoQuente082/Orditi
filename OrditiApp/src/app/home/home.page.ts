import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon, L } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController, ModalController } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Observable } from 'rxjs';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any = AppModule.getUsuario();

  map: Map = null;
  lat: any;
  long: any;

  //Zonas da cidade
  locais: any[];

  zona: any;

  constructor(
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public alertController: AlertController,
    public db: AngularFirestore,
    public modalCtrl: ModalController) {
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
        })
        //Fim do acesso ao Firebasse

        /** Criar mapa na posição atual do usuário **/
        marker([this.lat, this.long]).addTo(this.map)
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
    var regiao = polygon(area,{ color: 'gray', fillColor: '#838b8b'});
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

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: DetalheZonaPage,
      cssClass: 'modalIncompleto'
    });
    return await modal.present();
  }

  regiaoClicada(doc) {
    this.zona = doc.data()
    console.log(doc.data().nome)
  }

}
