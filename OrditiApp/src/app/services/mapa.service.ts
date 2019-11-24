import { Injectable } from '@angular/core';

import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon, L } from 'leaflet';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  map: Map = null;

  lat: any;
  long: any;

  constructor(
    public alertController: AlertController,
    public geolocation: Geolocation,
  ) { }


}
