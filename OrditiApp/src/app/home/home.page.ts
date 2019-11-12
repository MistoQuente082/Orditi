import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle , polygon } from 'leaflet';
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

    ionViewDidEnter() { this.leafletMap(); }

    /** Load leaflet map **/  
    leafletMap() {
      /** Set a time to reload the map **/
      setTimeout(() => {
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
          circle([51.508, -0.11], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(this.map);
          polygon([
          [51.509, -0.08],
          [51.503, -0.06],
          [51.51, -0.047]
        ]).addTo(this.map);
        polygon.bindPopup("I am a polygon.");
        }).catch((error) => {
          this.geolocationErrorAlert();
          console.log('Error getting location', error);
        });
      }, 50);
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
