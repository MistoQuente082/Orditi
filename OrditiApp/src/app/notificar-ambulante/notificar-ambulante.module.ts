import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificarAmbulantePage } from './notificar-ambulante.page';

const routes: Routes = [
  {
    path: '',
    component: NotificarAmbulantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificarAmbulantePage]
})
export class NotificarAmbulantePageModule {}
