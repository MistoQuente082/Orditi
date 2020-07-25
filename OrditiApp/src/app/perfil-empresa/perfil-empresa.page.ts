import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-perfil-empresa',
  templateUrl: './perfil-empresa.page.html',
  styleUrls: ['./perfil-empresa.page.scss'],
})
export class PerfilEmpresaPage implements OnInit {
  informacoes: boolean = false;

  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];
  empresa: any;

  constructor(
    public modalController: ModalController,
    public navParam: NavParams,
  ) {
    this.empresa = this.navParam.get('info');
   }

  async dismiss() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
  }

  mostrarInfor() {
    if (this.informacoes === false) {
      this.informacoes = true;
    }
    else {
      this.informacoes = false;
    }
  }

}
