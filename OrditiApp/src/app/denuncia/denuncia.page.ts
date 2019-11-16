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
  map2: Map;
  lat: any;
  long: any;

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
    if (this.map2) {
      this.map2.remove();
    }
    else {
      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.map2 = new Map('mapId2').setView([this.lat, this.long], 30);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
        }).addTo(this.map2);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
    /** Set a time to reload the map **/
    setTimeout(() => {
      this.leafletMap();
    }, 5000);
  }

  mapRemove() {
    //this.map2.remove(); -> Isso tava fazendo dar um erro bem grande
    this.returnHome();
  }
}
