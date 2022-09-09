import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { GithubComponent } from './github/github.component';
import { JavaComponent } from './java/java.component';
import { CotacaoComponent } from './cotacao/cotacao.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NewsComponent,
    TutorialComponent,
    GithubComponent,
    JavaComponent,
    CotacaoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatToolbarModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
