import { Component, OnInit } from '@angular/core';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { ModalController } from '@ionic/angular';

import _ from "lodash";

import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

@Component({
  selector: 'app-busca-ambulante',
  templateUrl: './busca-ambulante.page.html',
  styleUrls: ['./busca-ambulante.page.scss'],
})
export class BuscaAmbulantePage implements OnInit {

  public ambulantesTotal: any[];
  public ambulantes: any[];

  public tipo: any = "cpf";

  public filtro: any;

  constructor(
    private sqlOrditi: SqlOrditiService,
    public modalCtrl: ModalController
  ) {
    this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarAmbulantes.php').subscribe(data => {
      console.log(data);
          this.ambulantesTotal = data;
          this.ambulantes = this.ambulantesTotal;
        }, error => {
          console.log(error);
        });;
   }

  ngOnInit() {
  }

  async verMais(item) {
    const modal = await this.modalCtrl.create({
      component: PerfilAmbulantePage,
      componentProps: {
        info: item
      }
    });
    return await modal.present();
  }

  filtrar(busca: any) {
    console.log(this.tipo);
    let val = busca.target.value;
    console.log(val)
    if (val && val.trim() != "") {
      this.ambulantes = _.values(this.ambulantesTotal);
      this.ambulantes = this.ambulantes.filter(pessoa => {
        console.log(this.filtro);
        if(this.tipo === "cpf"){
          return (pessoa.identidade.indexOf(val) === 0)
        }
        if(this.tipo === "nome"){
          return (pessoa.nome.indexOf(val) === 0)
        }
      })
    }
    else {
      this.ambulantes = this.ambulantesTotal;
    }
  }

}
