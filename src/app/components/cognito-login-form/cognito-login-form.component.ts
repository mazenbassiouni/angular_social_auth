import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cognito-login-form',
  templateUrl: './cognito-login-form.component.html',
  styleUrls: ['./cognito-login-form.component.css']
})

export class CognitoLoginFormComponent implements OnInit {

  public form = {
    username: "",
    password: ""
  }

  isLoading: boolean = false;

  constructor (
    private api: ApiService,
    private token: TokenService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  CognitoLogin(){
    this.isLoading = true;
    let authenticationDetails = new AuthenticationDetails({
      Username: this.form.username,
      Password: this.form.password,
    });

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    let userPool = new CognitoUserPool(poolData);
    let userData = { Username: this.form.username, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (data) => {
        this.handleCognitoResponse(data);
      },
      onFailure: (error) => {
        console.log(error);
        
        alert(error.message || JSON.stringify(error));
        this.isLoading = false;
      },
    });
  }

  handleCognitoResponse(user: any){
    this.api.signin({
      idToken: user.idToken.jwtToken,
      provider: 'COGNITO'
    }).subscribe(
      (data) => {
        this.handleResponse(data);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  handleResponse(data: any) {
    if(data.success === true && data.access_token){
      this.token.handle(data.access_token);
      this.auth.changeAuthStatus(true);
      this.router.navigateByUrl('profile');
    }else{
      this.isLoading = false;
      console.log(data);
    }
  }

}
