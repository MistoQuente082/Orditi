import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.page.html',
  styleUrls: ['./editar-empresa.page.scss'],
})
export class EditarEmpresaPage implements OnInit {
  empresa: any;
  produtoslista: any[] = [];
  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];
  informacoes: boolean;
  atividade: boolean = true;
  trabalho: boolean;

  constructor(
    public navParam: NavParams,
    private modalController: ModalController
  ) {
    this.empresa = this.navParam.get('item');

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
    for (let prod of this.empresa.produto) {
      this.produtoslista.push(prod);
    }
  }

}
