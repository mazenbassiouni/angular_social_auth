import { Component } from '@angular/core';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface formDataInterface {
  "email": string;
  [key: string]: string;
};

@Component({
  selector: 'app-cognito-signup-form',
  templateUrl: './cognito-signup-form.component.html',
  styleUrls: ['./cognito-signup-form.component.css']
})
export class CognitoSignupFormComponent {

  public form = {
    username: "",
    email: "",
    password: ""
  }
  confirmCode!: string;
  

  isLoading: boolean = false;
  userRegistered: boolean = false;
  confirmIsLoading: boolean = false;

  constructor (
    private api: ApiService,
    private token: TokenService,
    private router: Router,
    private auth: AuthService
  ) {}


  cognitoSignUp(){
    this.isLoading = true;

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    let userPool = new CognitoUserPool(poolData);
    let attributeList = [];

    let formData: formDataInterface = {
      "email": this.form.email
    } 

    for (let key  in formData) {
      let attrData = {
        Name: key,
        Value: formData[key]
      }
      let attribute = new CognitoUserAttribute(attrData);
      attributeList.push(attribute)
    }

    userPool.signUp(this.form.username, this.form.password, attributeList, [], (error, data) =>{
      if (error) {
        alert(error.message || JSON.stringify(error));
        this.isLoading = false;
        return;
      }

      this.userRegistered = true;
      
    })
  }

  cognitoConfirm(){
    this.confirmIsLoading = true;

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    let userPool = new CognitoUserPool(poolData);

    let userData = { Username: this.form.username, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(this.confirmCode, true, (error, data) => {
      if (error) {
        alert(error.message || JSON.stringify(error));
        return;
      }
      this.cognitoLogin();
    });
  }

  cognitoLogin(){
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
        console.log(data);
        
        this.handleCognitoResponse(data);
      },
      onFailure: (err) => {
        console.log(err);
        
        alert(err.message || JSON.stringify(err));
        this.isLoading = false;
      },
    });
  }

  handleCognitoResponse(user: any){
    this.api.signup({
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
      console.log(data);
    }
  }

}