import { Component, OnInit } from '@angular/core';
import { AppModule } from '../app.module';

import _ from "lodash";

import { ModalController } from '@ionic/angular';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { LoginBancoService } from '../services/login/login-banco.service';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';
import { PerfilEmpresaPage } from '../perfil-empresa/perfil-empresa.page';
//import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {

  public zonas: any[];
  public areaFoto: any = "../../assets/img/Região.jpg";

  public ambulantesTotal: any[];
  public ambulantes: any[];

  public zonasTotal: any[];

  public tipo: any = "zona";

  public cpf: any;
  public regiao: any;
  labelPesquisa: any;
  tipo1: string;
  empresasTotal: any[];
  empresas: any[];

  constructor(
    private loginBanco: LoginBancoService,
    private sqlOrditi: SqlOrditiService,
    private listaAmbulante: ListaAmbulantesService,

    public modalCtrl: ModalController) {
    this.listaAmbulante.recuperar('lista').then((data) => {
      console.log(data);
      this.ambulantesTotal = data;
      this.ambulantes = this.ambulantesTotal;
    }, error => {
      console.log(error);
    });;

    this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarEmpresas.php').subscribe(data => {
      this.empresasTotal = data;
      this.empresas = this.empresasTotal;
    }, error => {
      console.log(error);
    });;

    this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarZonas.php').subscribe(data => {
      this.zonasTotal = data;
      this.zonas = this.zonasTotal;
    }, error => {
      console.log(error);
    });;
  }

  tipoPesquisa(tipo) {
    if (tipo === 'zona') {
      this.labelPesquisa = "Digite o nome da regiao";

    }

    else {
      this.labelPesquisa = "Digite o nome do ambulante";
      this.tipo1 = 'pessoa';
    }

    console.log('THIS.LABELPESSOA', this.labelPesquisa)
  }

  Fiscal() {
    return this.loginBanco.res_usuario;

  }


  filtrar(busca, tipo) {

    let val = busca.target.value;
    console.log(val)
    console.log('ZONA 1', this.tipo1)
    if (this.tipo === 'nome' || this.tipo === 'cpf') {
      if (val && val.trim() != "") {
        this.ambulantes = _.values(this.ambulantesTotal);
        this.ambulantes = this.ambulantes.filter(pessoa => {


          if (tipo === "cpf") {
            return (pessoa.identidade.toLowerCase().indexOf(val.toLowerCase()) > -1)
          }
          if (tipo === "nome") {
            return (pessoa.nome.toLowerCase().indexOf(val.toLowerCase()) > -1)
          }


        })
      }
      else {
        this.ambulantes = this.ambulantesTotal;
      }
    }

    else {
      if (val && val.trim() != "") {
        if (tipo === 'zona') {
          this.zonas = _.values(this.zonasTotal);
          console.log(this.zonas);
          this.zonas = this.zonas.filter(zona => {
            return (zona.nome.toLowerCase().indexOf(val.toLowerCase()) > -1)
          });
        }
        else {

          this.empresas = _.values(this.empresasTotal);
          console.log(this.empresas);
          this.empresas = this.empresas.filter(empresa => {
            return (empresa.cnpj.toLowerCase().indexOf(val.toLowerCase()) > -1)
          });

        }
      }


    }
  }





  async modal(item, tipo, foto) {

    if (tipo === 'zona') {
      console.log('click')
      const modal = await this.modalCtrl.create({
        component: DetalheZonaPage,
        componentProps: {
          info: item,
          foto: foto

        }
      });
      return await modal.present();

    }
    if (tipo === 'cnpj') {
      const modal = await this.modalCtrl.create({
        component: PerfilEmpresaPage,
        componentProps: {
          info: item
        }
      });
      return await modal.present();
    }



    else {
      const modal = await this.modalCtrl.create({
        component: PerfilAmbulantePage,
        componentProps: {
          info: item
        }
      });
      return await modal.present();
    }



  }

  ngOnInit() {
  }

}
