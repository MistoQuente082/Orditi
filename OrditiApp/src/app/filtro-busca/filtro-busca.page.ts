import { Component, OnInit } from '@angular/core';
import { LoginBancoService } from '../services/login/login-banco.service';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { ModalController } from '@ionic/angular';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';
import { MostrarListaPage } from '../mostrar-lista/mostrar-lista.page';

@Component({
  selector: 'app-filtro-busca',
  templateUrl: './filtro-busca.page.html',
  styleUrls: ['./filtro-busca.page.scss'],
})
export class FiltroBuscaPage implements OnInit {

  pessoasTotal: any[];
  lista: any[] = [];

  bairros: any[] = ['Área Rural','Antares','Barro Duro','Bebedouro','Benedito Bentes','Bom Parto','Canaã','Centro','Chã da Jaqueira','Chã de Bebedouro','Cidade Universitária','Clima Bom','Cruz das Almas','Farol','Feitosa','Fernão Velho','Garça Torta','Gruta de Lourdes','Guaxuma','Ipioca','Jacarecica','Jacintinho','Jaraguá','Jardim Petrópolis'    ,'Jatiúca','Levada','Mangabeiras','Mutange','Ouro Preto','Pajuçara','Pescaria','Petrópolis','Pinheiro','Pitanguinha','Poço','Ponta da Terra','Ponta Grossa','Ponta Verde','Pontal da Barra','Prado','Riacho Doce','Rio Novo','Santa Amélia','Santa Lúcia','Santo Amaro','Santos Dumont','São Jorge','Serraria','Tabuleiro do Martins','Trapiche da Barra','Vergel do Lago']
  equipamento: any[];
  produto: any[];
  bairro: any[] = [];

  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos', 'Ornamentos', 'Confecções', 'Calçados', 'Artigos de uso pessoal', 'Louças', 'Ferragens', 'Artefatos de plástico, borracha ou couro', 'Utensílios Domésticos', 'Artesanato e Antiguidades', 'Arte em geral', 'Outros'];

  min_area: any = null;
  max_area: any = null;
  listaFiltro: any;

  constructor(
    public modalController: ModalController,
    private loginBanco: LoginBancoService,
    private sqlOrditi: SqlOrditiService,
    private listaAmbulante: ListaAmbulantesService,
    private listaFiltrada: ListaAmbulantesService,
  ) {

    this.listaAmbulante.recuperar('lista1').then((data)=>{
      this.listaFiltro = data;
      console.log(data)
    })

    this.listaAmbulante.recuperar('lista').then((data)=>{
          this.pessoasTotal = data;
        }, error => {
          console.log(error);
        });;
   }

  ngOnInit() {

  }

  gerarLista(){
    this.lista = [];
    this.pessoasTotal.forEach( e =>{
      var endereco = e['endereco'];
      endereco = endereco.split(", ");
      var equipamento = e['area_equipamento'].split('x')
      var area = parseFloat(equipamento[1])*parseFloat(equipamento[2])
      var maxarea;
      var minarea;

      if (this.min_area === null){
        minarea = 0;
      }
      if(this.max_area === null){
        maxarea = 10000000000;
      }
      var bairr
      if(this.bairro.length <= 0){
        bairr = this.bairros
      } else{
        bairr = this.bairro
      }
      var prod;
      if(this.produto.length <=0){
        prod = this.produtos
      } else{
        prod = this.produto;
      }
      if(bairr.includes(endereco[1]) && minarea<= area && maxarea >=area && e['produto'].some(item => prod.includes(item)) ){
        this.lista.push(e);
      }
      console.log(this.bairro)
    })
    this.modalLista(this.lista)
  }

  allClickedCategories(){    
    console.log(this.bairro);
    if(this.bairro != []){
      
    } else {
      this.bairro = [];
    }    
  }

  async modalLista(lista){
    const modal = await this.modalController.create({
      component: MostrarListaPage,
      componentProps: {
        lista: lista
      }
    });

    await modal.present();
  }

  async verLista(){
    
    const modal = await this.modalController.create({
      component: MostrarListaPage,
      componentProps: {
        lista: this.listaFiltro
      }
    });

    await modal.present();
  }

}
