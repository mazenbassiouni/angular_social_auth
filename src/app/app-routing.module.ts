import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoggedInService } from './services/logged-in.service';
import { LoggedOutService } from './services/logged-out.service';

const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent, canActivate : [LoggedOutService] },
  { path: 'signup', component: RegisterComponent, canActivate : [LoggedOutService] },
  { path: 'profile', component: ProfileComponent, canActivate : [LoggedInService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
