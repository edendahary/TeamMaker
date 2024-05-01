import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
  

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
];
