import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home', //troca pelo caminho da tela de boas-vindas
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'denuncia', loadChildren: './denuncia/denuncia.module#DenunciaPageModule' },
  { path: 'autuacao', loadChildren: './autuacao/autuacao.module#AutuacaoPageModule' },
  { path: 'cadastro', loadChildren: './cadastro/cadastro.module#CadastroPageModule' },
  { path: 'mapa-modal', loadChildren: './mapa-modal/mapa-modal.module#MapaModalPageModule' },
  { path: 'detalhe-zona', loadChildren: './detalhe-zona/detalhe-zona.module#DetalheZonaPageModule' },
  { path: 'informacoes', loadChildren: './informacoes/informacoes.module#InformacoesPageModule' },
  { path: 'perfil-ambulante', loadChildren: './perfil-ambulante/perfil-ambulante.module#PerfilAmbulantePageModule' },
  { path: 'busca', loadChildren: './busca/busca.module#BuscaPageModule' },
  { path: 'editar-ambulante', loadChildren: './editar-ambulante/editar-ambulante.module#EditarAmbulantePageModule' },
  { path: 'eventos', loadChildren: './eventos/eventos.module#EventosPageModule' },
  { path: 'detalhe-eventos', loadChildren: './detalhe-eventos/detalhe-eventos.module#DetalheEventosPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
