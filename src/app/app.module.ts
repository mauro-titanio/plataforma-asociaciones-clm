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
import {AngularFireStorageModule, BUCKET } from '@angular/fire/storage';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthService } from './shared/services/auth/auth.service';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { VerificationComponent } from './components/verification/verification.component';
import { RouterModule } from '@angular/router';
import { AssociationProfileComponent } from './components/association-profile/association-profile.component';
import { AssociationFormComponent } from './components/association-form/association-form.component';




@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    VerificationComponent,
    AssociationProfileComponent,
    AssociationFormComponent,
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
      position:{
        horizontal:{
          position: 'right'
        }
      }
    }),

  ],
  providers: [AuthService,
    { provide: BUCKET, useValue: environment.firebase.storageBucket }],
  bootstrap: [AppComponent]
})
export class AppModule { }
