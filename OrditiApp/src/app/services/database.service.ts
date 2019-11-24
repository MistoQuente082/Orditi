import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public db: AngularFirestore,
    public alertas: AlertasService, ) { }

  createDocSemID(dados, local) {
    try {
      this.db.collection(local).add(dados);
    } catch{
      err =>
        console.log("Algo deu errado: " + err)
    }
  }

  createDocComID(dados, local, id) {
    try {
      this.db.collection(local).doc(id).get().toPromise().then(doc => {
        if (!doc.exists) {
          this.db.collection(local).doc(id).set(dados);
          return true
        }
        else {
          console.log("O documento ja existe");
          return false
        }
      })
    } catch{
      err => {
        console.log("Algo deu errado: " + err)
      }
    }
  }

  readDoc(local, id) {
    this.db.collection(local).doc(id).get().toPromise().then(doc => {
      return doc.data();
    }).catch(err => {
      console.log("err");
      return false;
    })
  }

  readCollection(local) {
    this.db.collection(local).get().toPromise().then(snapshot => {
      return snapshot;
    })
  }

  readCollectionFiltrada(local, filtro, operacao, alvo) {
    return this.db.collection(local, ref => ref.where(filtro, operacao, alvo)).valueChanges();
  }

  udateDoc(dados, local, id) {
    try {
      this.db.collection(local).doc(id).get().toPromise().then(doc => {
        this.db.collection(local).doc(id).update(dados);
        return true;
      });
    } catch{
      err => console.log("Algo deu errado: " + err)
    }
  }
}
