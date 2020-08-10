import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { CadastroPage } from '../cadastro/cadastro.page';
import { NavigationExtras, Router } from '@angular/router';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';
import * as moment from 'moment';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';

@Component({
  selector: 'app-perfil-empresa',
  templateUrl: './perfil-empresa.page.html',
  styleUrls: ['./perfil-empresa.page.scss'],
})
export class PerfilEmpresaPage implements OnInit {
  empresa: any;
  trabalho: boolean;
  informacoes: boolean;
  historicoLista: any;
  funcionarios: any[];
  atividade: boolean = true;
  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];

  produtoslista: any[]= [];

  constructor(
    public sqlOrditi: SqlOrditiService,

    public navParam: NavParams,
    private modalController: ModalController,
    public dadosEmpresa: ListaAmbulantesService,
    private router: Router
  ) {

    this.empresa = this.navParam.get('info');
    console.log('empresa', this.empresa);
    this.sqlOrditi.receberFuncionarios(this.empresa.id).subscribe(data => {
      console.log('meu data', data)
      this.funcionarios = data;
    });

  }
  async adicionarAmbulante(idEmpresa, contadorAmbulante, maximo) {
    contadorAmbulante = parseInt(contadorAmbulante, 10);
    maximo = parseInt(maximo, 10);

    let condition = contadorAmbulante < maximo;
    let novoContadorAmbulante: number;

    if (condition) {
      novoContadorAmbulante = contadorAmbulante + 1;
    }
    console.log(novoContadorAmbulante)

    this.dadosEmpresa.dadosEmpresa = {
      idEmpresa: idEmpresa,
      tipo: true,
      contador: novoContadorAmbulante
    }
    this.router.navigate(['/cadastro']);
    this.dismiss();

  }

  mostrarAtividade() {
    if (this.atividade === false) {
      this.atividade = true;
    }
    else {
      this.atividade = false;
    }
  }

  mostrarTrabalho() {
    if (this.trabalho === false) {
      this.trabalho = true;


    }
    else {
      this.trabalho = false;
    }
  }

  mostrarInfor() {
    if (this.informacoes === false) {
      this.informacoes = true;
    }
    else {
      this.informacoes = false;
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    for(let prod of this.empresa.produto){
      this.produtoslista.push(prod);
    }
  }

}
