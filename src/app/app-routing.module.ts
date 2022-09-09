import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import  { NewsComponent } from './news/news.component';
import { CotacaoComponent } from './cotacao/cotacao.component';
import { GithubComponent } from './github/github.component';
import { JavaComponent } from './java/java.component';
import { TutorialComponent } from './tutorial/tutorial.component';


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
    component: TutorialComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
