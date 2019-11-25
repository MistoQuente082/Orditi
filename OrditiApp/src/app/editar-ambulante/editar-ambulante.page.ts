import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-ambulante',
  templateUrl: './editar-ambulante.page.html',
  styleUrls: ['./editar-ambulante.page.scss'],
})
export class EditarAmbulantePage implements OnInit {
  // Variaveis da pessoa
  public nome: string;
  public cpf: string;
  public escolaridade: string;
  public endereco: string;
  public fone: string;

  // Variaveis Do trabalho
  public produto: string;
  public pontoRef: string;
  public localAtiv: string = "Anaaaaaa";
  public regiao: string;

  constructor() { }

  ngOnInit() {
  }

}
