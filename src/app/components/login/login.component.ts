import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socialUser!: SocialUser;
  isLoggedin?: boolean = undefined;
  constructor(
    private api: ApiService,
    private socialAuthService: SocialAuthService,
    private token: TokenService,
    private router: Router,
    private auth: AuthService
  ){}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      
      if(user && !this.isLoggedin){
        this.isLoggedin = user != null;
        this.api.signin(user).subscribe(
          data => this.handleResponse(data),
          error => console.log(error)
        );
      }
    });
  }

  handleResponse(data: any) {
    if(data.success === true && data.access_token){
      this.token.handle(data.access_token);
      this.auth.changeAuthStatus(true);
      this.router.navigateByUrl('profile');
    }else if(data.success == false && data.message){
      alert(data.message);
      this.signOut();
    }else{
      console.log(data);
      this.signOut();
    }
  }

  FBLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

}
