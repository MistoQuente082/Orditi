import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {
  public pessoa: any;

  constructor(public navParams: NavParams, ) {
    this.pessoa = this.navParams.get('pessoa');
    console.log(this.pessoa)
  }

  ngOnInit() {
  }

}
