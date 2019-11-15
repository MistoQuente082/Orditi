import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle , Icon } from 'leaflet';
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
          var circulo1 = circle([51.508, -0.11], {
            name:'centro de maceió',
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 5000
        }).addTo(this.map);
          circulo1.bindPopup("sou um cirulo1")
         var circulo2 = circle([39.508, -0.9], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(this.map);
          circulo2.bindPopup("sou um circulo2!")
        }).catch((error) => {
          this.geolocationErrorAlert();
          console.log('Error getting location', error);
        });
      }, 50);
      var LeafIcon = Icon.extend({
        options: {
          shadowUrl: 'leaf-shadow.png',
          iconSize:     [38, 95],
          shadowSize:   [50, 64],
          iconAnchor:   [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -76]
      }
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