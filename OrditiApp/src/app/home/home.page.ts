import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Observable } from 'rxjs';

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

  constructor(private geolocation: Geolocation,
    public alertController: AlertController,
    public db: AngularFirestore) {
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
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map);
        /** Create a marker on your current position **/
        marker([this.lat, this.long]).addTo(this.map)
          .bindPopup('Você está aqui!')
          .openPopup();

        /** Criar poligonos a partir de dados do firebase */
        this.db.collection('zonas').get().toPromise().then(snapshot => {
          snapshot.forEach(doc => {
            var zona = doc.data().local;
            var area = [];
            for (var ponto in zona) {
              area.push([zona[ponto].latitude, zona[ponto].longitude])
            }
            console.log(area);
            var regiao = polygon(area);
            regiao.addTo(this.map);
            regiao.bindPopup(doc.data().nome);
          })
        })

        /** poligono praça lions */
        var zona2 = polygon([
          [
            -35.70979356765747,
            -9.662660610882655
          ],
          [
            -35.709471702575684,
            -9.663221171633174
          ],
          [
            -35.70867776870727,
            -9.662888008280808
          ],
          [
            -35.70888698101044,
            -9.662375041839407
          ],
          [
            -35.70979356765747,
            -9.662660610882655
          ]
        ]);
        console.log(zona2)
        zona2.addTo(this.map);
        zona2.bindPopup("praça Lions");

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


  /** Create an alert when geolocation function fails **/
  async geolocationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Erro',
      subHeader: 'Não foi possível definir a localização',
      buttons: ['OK']
    });
    await alert.present();
  }

}