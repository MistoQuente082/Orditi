import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle , Icon , polygon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: Map;
  lat: any;
  long: any;

  constructor(private geolocation: Geolocation, public alertController: AlertController) {}

    ionViewDidEnter() { 
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

        /** poligono praça gogó */
        var zona1 = polygon([])
        zona1.addTo(this.map)
        zona1.bindPopup("praça gogó do eno")
        /** poligono praça lions */
        var zona2 = polygon([])
        zona2.addTo(this.map)
        zona2.bindPopup("praça Lions")
        /** poligono orla */
        var zona3 = polygon([])
        zona3.addTo(this.map)
        zona3.bindPopup("Orla urbana")
      }).catch((error) => {
        console.log('Error getting location', error);
        this.geolocationErrorAlert();
      });
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