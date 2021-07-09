import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/shared/services/auth/auth.service';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  


registerForm: FormGroup




  constructor(private authService: AuthService, private router: Router,private notifier: NotifierService,  private fb: FormBuilder,) { 
  
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  get f() {
    return this.registerForm.controls
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home'])
    }
  }
  


register(){
  console.log("signin")
  this.authService.signUp(this.f.email.value,this.f.password.value)
}

  loginGoogle() {
    console.log("login")
    this.authService.googleAuth().then(success => {
      document.getElementById('modalClose')?.click()
      this.notifier.notify('success', 'Acceso realizado')
      this.router.navigate(['/home'])
    }).catch(error => {
      console.error("Error en el login")
    })
  }
  loginFb() {
    console.log("login")
    this.authService.loginWithFB().then(success => {
      document.getElementById('modalClose')?.click()
      this.router.navigate(['/home'])
    }).catch(error => {
      console.error("Error en el login")
    })
  }





}
