import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthService } from './shared/services/auth/auth.service';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VerificationComponent } from './components/verification/verification.component';
import { RouterModule } from '@angular/router';
import { AssociationProfileComponent } from './components/association-profile/association-profile.component';
import { AssociationFormComponent } from './components/association-form/association-form.component';
import { AssociationsListComponent } from './components/associations-list/associations-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { OffersListComponent } from './components/offers-list/offers-list.component';
import { OffersDashboardComponent } from './components/offers-dashboard/offers-dashboard.component';






@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    NavbarComponent,
    VerificationComponent,
    AssociationProfileComponent,
    AssociationFormComponent,
    AssociationsListComponent,
    PrivacyComponent,
    OffersListComponent,
    OffersDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right'
        }
      }
    }),
    NgSelectModule,
    Ng2SearchPipeModule
  ],
  providers: [AuthService,
    { provide: BUCKET, useValue: environment.firebase.storageBucket }],
  bootstrap: [AppComponent]
})
export class AppModule { }
