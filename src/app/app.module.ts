import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { CotacaoComponent } from './cotacao/cotacao.component';
import { FooterComponent } from './footer/footer.component';
import { GithubComponent } from './github/github.component';
import { HomeComponent } from './home/home.component';
import { JavaComponent } from './java/java.component';
import { NewsComponent } from './news/news.component';
import { TutoriaisComponent } from './tutoriais/tutoriais.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    CotacaoComponent,
    FooterComponent,
    GithubComponent,
    HomeComponent,
    JavaComponent,
    NewsComponent,
    TutoriaisComponent,
    HeaderMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
