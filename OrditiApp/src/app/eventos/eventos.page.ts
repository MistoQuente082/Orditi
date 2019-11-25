import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  public eventos: Observable<any[]>;

  constructor(public db: AngularFirestore, ) {
    this.eventos = this.db.collection('eventos', ref => ref.orderBy('dataInicio', 'asc')).valueChanges();
  }

  ngOnInit() {
  }

}
