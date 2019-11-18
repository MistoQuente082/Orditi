import { Component, OnInit } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Router } from '@angular/router';

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.page.html',
  styleUrls: ['./denuncia.page.scss'],
})
export class DenunciaPage implements OnInit {
  map2: Map = null;
  lat: any;
  long: any;
  latLngC: any;
  routes = [
    {
      path: '',
      redirectTo: 'home'
    }
  ];

  returnHome() {
    this.router.navigate(['/home']);
  }

  constructor(private geolocation: Geolocation, public router: Router) { }

  ngOnInit() {
    this.leafletMap();
  }

  /** Load leaflet map **/
  leafletMap() {
    if (this.map2 !== 'undefined' && this.map2 !== null) {
      this.map2.remove();
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.map2 = new Map('mapId2').setView([this.lat, this.long], 30);
        this.map2.on('click', function(e){mapMarker(e);});
           
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map2);

        function mapMarker(e) {
          console.log("Objeto: ", e);
          console.log("Latlng: ", e.latlng);
          console.log("Lat: ", e.latlng.lat);
          console.log("Lng: ", e.latlng.lng);
          marker(e.latlng).addTo(this.map2);
        }

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  }

  mapRemove() {
    //this.map2.remove(); -> Isso tava fazendo dar um erro bem grande
    this.returnHome();
  }
}
