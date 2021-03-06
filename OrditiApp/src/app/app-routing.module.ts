import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
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
  { path: 'detalhe-eventos', loadChildren: './detalhe-eventos/detalhe-eventos.module#DetalheEventosPageModule' },
  { path: 'filtro-busca', loadChildren: './filtro-busca/filtro-busca.module#FiltroBuscaPageModule' },
  { path: 'notificar-ambulante', loadChildren: './notificar-ambulante/notificar-ambulante.module#NotificarAmbulantePageModule' },
  { path: 'mostrar-lista', loadChildren: './mostrar-lista/mostrar-lista.module#MostrarListaPageModule' },
  { path: 'perfil-empresa', loadChildren: './perfil-empresa/perfil-empresa.module#PerfilEmpresaPageModule' },
  { path: 'editar-empresa', loadChildren: './editar-empresa/editar-empresa.module#EditarEmpresaPageModule' }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
