import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map } from "leaflet";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: Map;
  marker: any;
  latlong: [];

  constructor(
    private geolocation: Geolocation
  ) {}
  showMap(){
    this.map= new Map("Mymap").setView([])
  }

}
