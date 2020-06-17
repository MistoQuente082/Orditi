import { Component, OnInit } from '@angular/core';
import { LoginBancoService } from '../services/login/login-banco.service';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';

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
  bairro: any[];

  min_area: any = null;
  max_area: any = null;

  constructor(
    private loginBanco: LoginBancoService,
    private sqlOrditi: SqlOrditiService,
  ) {
    this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarAmbulantes.php').subscribe(data => {
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
      console.log(e);

      var endereco = e['endereco'];
      endereco = endereco.split(", ");

      var equipamento = e['area_equipamento'].split('x')
      var area = parseFloat(equipamento[1])*parseFloat(equipamento[2])

      if (this.min_area === null){
        this.min_area = 0;
      }
      if(this.max_area === null){
        this.max_area = 10000000000;
      }

      if(this.bairro === []){
        this.bairro = ['Área Rural','Antares','Barro Duro','Bebedouro','Benedito Bentes','Bom Parto','Canaã','Centro','Chã da Jaqueira','Chã de Bebedouro','Cidade Universitária','Clima Bom','Cruz das Almas','Farol','Feitosa','Fernão Velho','Garça Torta','Gruta de Lourdes','Guaxuma','Ipioca','Jacarecica','Jacintinho','Jaraguá','Jardim Petrópolis'    ,'Jatiúca','Levada','Mangabeiras','Mutange','Ouro Preto','Pajuçara','Pescaria','Petrópolis','Pinheiro','Pitanguinha','Poço','Ponta da Terra','Ponta Grossa','Ponta Verde','Pontal da Barra','Prado','Riacho Doce','Rio Novo','Santa Amélia','Santa Lúcia','Santo Amaro','Santos Dumont','São Jorge','Serraria','Tabuleiro do Martins','Trapiche da Barra','Vergel do Lago']
      }
      

      if(this.bairro.includes(endereco[1]) && this.min_area<= area && this.max_area >=area){
        console.log("yeetz")
        this.lista.push(e);
      }
    })
    console.log(this.lista);
    console.log(this.pessoasTotal);
    console.log(this.min_area);
    console.log(this.max_area);
  }

  allClickedCategories(){    
    console.log(this.bairro);
    if(this.bairro != []){
      
    } else {
      this.bairro = [];
    }
    
    
  }

}
