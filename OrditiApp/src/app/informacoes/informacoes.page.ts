import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-informacoes',
  templateUrl: './informacoes.page.html',
  styleUrls: ['./informacoes.page.scss'],
})
export class InformacoesPage implements OnInit {
  public eventos: Observable<any[]>;

  constructor( ) {
    //this.eventos = this.db.collection('eventos', ref => ref.orderBy('dataInicio', 'asc')).valueChanges();
  }

  ngOnInit() {
  }

}
