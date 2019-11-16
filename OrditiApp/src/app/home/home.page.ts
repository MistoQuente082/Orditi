import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle , Icon, Polygon } from 'leaflet';
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
          var zona1 = Polygon([
            -35.69711476564407,
            -9.66457497487766
          ],
          [
            -35.69653540849686,
            -9.66451415961439
          ],
          [
            -35.69626182317734,
            -9.66445070019752
          ],
          [
            -35.69614380598068,
            -9.664397817340982
          ],
          [
            -35.696106255054474,
            -9.664347578619571
          ],
          [
            -35.6969940662384,
            -9.664080520027214
          ],
          [
            -35.69713890552521,
            -9.664543245176464
          ],
          [
            -35.69711476564407,
            -9.66457497487766
          ],
          {
            name:'Praça gogó da ema',
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 5000
        })
        zona1.addTo(this.map);
        zona1.bindPopup("Praça gogó da ema");
         var zona2 = Polygon( [
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
        ],
        {
            name: "Praça lions" , 
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        })
        zona2.addTo(this.map);
        zona2.bindPopup("Praça lions")
        var zona3 = Polygon( [
          -35.70312023162842,
          -9.66372884848818
        ],
        [
          -35.70523381233215,
          -9.66372884848818
        ],
        [
          -35.70778727531433,
          -9.664024992966544
        ],
        [
          -35.70849537849426,
          -9.664247101154244
        ],
        [
          -35.71022272109985,
          -9.66523072136591
        ],
        [
          -35.711939334869385,
          -9.66660566953019
        ],
        [
          -35.71344137191772,
          -9.66800176499264
        ],
        [
          -35.71487903594971,
          -9.669863216594326
        ],
        [
          -35.715951919555664,
          -9.671491978292936
        ],
        [
          -35.717196464538574,
          -9.674157207687914
        ],
        [
          -35.716145038604736,
          -9.673522631177278
        ],
        [
          -35.71425676345825,
          -9.670624716552389
        ],
        [
          -35.71333408355713,
          -9.669397854659866
        ],
        [
          -35.712153911590576,
          -9.668065223739609
        ],
        [
          -35.71086645126343,
          -9.666753740535768
        ],
        [
          -35.70955753326416,
          -9.665548017594919
        ],
        [
          -35.70827007293701,
          -9.664871118611263
        ],
        [
          -35.70571660995483,
          -9.66404614613359
        ],
        [
          -35.70312023162842,
          -9.66372884848818
        ],
        {
            name: "Orla urbana" , 
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        })
        zona3.addTo(this.map);
        zona3.bindPopup("Orla urbana")
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