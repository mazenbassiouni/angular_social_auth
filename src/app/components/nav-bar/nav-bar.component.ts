import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public loggedIn!: boolean;

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) {}

  ngOnInit(): void {
    this.auth.authStatus.subscribe( value => this.loggedIn = value)
  }

  logout(){
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('');
    this.socialAuthService.signOut();
  }
}
