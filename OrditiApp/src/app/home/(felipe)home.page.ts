import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon, L } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: Map;
  lat: any;
  long: any;

  constructor(private geolocation: Geolocation,
    public alertController: AlertController,
    public db: AngularFirestore) { }

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

      var polyindex = 0;
      var popup = new L.Popup();

      var geojsonLayer = new L.GeoJSON(null, {});

      geojsonLayer.on("featureparse", function (e) {

        (function (layer, properties) {

          //click event that triggers the popup and centres it on the polygon
          layer.on("click", function (e) {
            var bounds = layer.getBounds();
            var popupContent = "mais um ambulante adicionado!";
            popup.setLatLng(bounds.getCenter());
            popup.setContent(popupContent);
            this.map.openPopup(popup);
          });

        })(e.layer, e.properties);

        //assign polygon id so we can reference it later
        e.layer.pDwvSQyhusSmJsV1G1fq = 'capacidade' + polyindex + '';

        //increment polyindex used for unique polygon id's
        polyindex++;
      });

      //add the polygon layer
      this.map.addLayer(geojsonLayer);
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