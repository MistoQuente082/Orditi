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

  routes = [
    {
      path: '',
      redirectTo: 'home'
    }
  ];

  returnHome() {
    this.router.navigate(['/home']);
  }

  constructor(private geolocation: Geolocation,
    public router: Router) { }

  ngOnInit() {
  }

}
