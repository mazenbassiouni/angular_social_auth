import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { TokenService } from './services/token.service'
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CognitoLoginFormComponent } from './components/cognito-login-form/cognito-login-form.component';
import { CognitoSignupFormComponent } from './components/cognito-signup-form/cognito-signup-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    CognitoLoginFormComponent,
    CognitoSignupFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ ApiService, TokenService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookAppKey),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GoogleClientId)
          }
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
