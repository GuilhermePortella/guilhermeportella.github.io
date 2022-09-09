import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotacaoComponent } from './cotacao/cotacao.component';
import { GithubComponent } from './github/github.component';
import { HomeComponent } from './home/home.component';
import { JavaComponent } from './java/java.component';
import { NewsComponent } from './news/news.component';
import { TutoriaisComponent } from './tutoriais/tutoriais.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '/',
    component: HomeComponent
  },
  {
    path: 'GuilhermePortella.github.io',
    component: HomeComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'cotacao',
    component: CotacaoComponent
  },
  {
    path: 'GuilhermePortella.github.io',
    component: HomeComponent
  },
  {
    path: 'github',
    component: GithubComponent
  },
  {
    path: 'java',
    component: JavaComponent
  },
  {
    path: 'tutorial',
    component: TutoriaisComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
