import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  socialUser!: SocialUser;
  isLoggedin?: boolean = undefined;
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private socialAuthService: SocialAuthService,
    private token: TokenService,
    private router: Router
  ){}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      
      if(user && !this.isLoggedin){
        this.isLoggedin = user != null;
        this.api.signup(user).subscribe(
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
    }else if(data.success === false && data.message){
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
