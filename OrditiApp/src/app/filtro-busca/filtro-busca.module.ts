import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FiltroBuscaPage } from './filtro-busca.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroBuscaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FiltroBuscaPage]
})
export class FiltroBuscaPageModule {}
