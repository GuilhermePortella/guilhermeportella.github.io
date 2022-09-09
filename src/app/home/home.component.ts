import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute ) { }

  ngOnInit(): void {
  }

  homeButton(): void{
    this.router.navigate(['/home']);
  }

  newsButton(): void{
    this.router.navigate(['news']);
  }

  cotacaoButton(): void{
    this.router.navigate(['cotacao']);
  }

  githubButton(): void{
    this.router.navigate(['github']);
  }

  javaButton(): void{
    this.router.navigate(['java']);
  }

  tutorialButton(): void{
    this.router.navigate(['tutorial']);
  }

}
