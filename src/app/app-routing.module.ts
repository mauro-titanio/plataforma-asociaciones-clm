import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssociationProfileComponent } from './components/association-profile/association-profile.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { VerificationComponent } from './components/verification/verification.component';
import { AuthGuard } from './shared/services/auth/guard/guard.guard';

const routes: Routes = [
  { path: '', component: SignInComponent, pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'verification', component: VerificationComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: AssociationProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
