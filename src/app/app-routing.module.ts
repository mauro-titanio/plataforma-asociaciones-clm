import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssociationFormComponent } from './components/association-form/association-form.component';
import { AssociationProfileComponent } from './components/association-profile/association-profile.component';
import { AssociationsListComponent } from './components/associations-list/associations-list.component';
import { HomeComponent } from './components/home/home.component';
import { OffersDashboardComponent } from './components/offers-dashboard/offers-dashboard.component';
import { OffersListComponent } from './components/offers-list/offers-list.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { VerificationComponent } from './components/verification/verification.component';
import { AuthGuard } from './shared/services/auth/guard/guard.guard';

const routes: Routes = [
  { path: '', component: SignInComponent, pathMatch: 'full', redirectTo: '' },
  { path: 'home', component: HomeComponent, /*canActivate: [AuthGuard] */ },
  { path: 'verification', component: VerificationComponent, /*canActivate: [AuthGuard] */ },
  { path: 'profile/:userID/:assID', component: AssociationProfileComponent, pathMatch: 'full' },
  { path: 'create/:assID', component: AssociationFormComponent },
  { path: 'associations', component: AssociationsListComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'offers', component: OffersListComponent },
  { path: 'offers/:userId', component: OffersDashboardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
