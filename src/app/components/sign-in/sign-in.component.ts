import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MustMatch } from 'src/app/shared/services/validation/validation';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  registerForm: FormGroup
  loginForm: FormGroup
  vw: number = 0
  verificationSent = false
  logFormSent = false

  constructor(private authService: AuthService, private router: Router, private notifier: NotifierService, private fb: FormBuilder,) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: MustMatch('password', 'confirmPassword') }
    )
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home'])
    }
  }

  get f() {
    return this.registerForm.controls
  }


  get g() {
    return this.loginForm.controls
  }


  register() {
    if (this.registerForm.invalid) {
      this.notifier.notify('error', 'Email y/o contraseña invalidos')
      return
    }
    this.authService.signUp(this.f.email.value, this.f.password.value)
  }


  loginEmailPsw() {
    if (this.loginForm.invalid) {
      this.notifier.notify('error', 'Email y/o contraseña invalidos')
      this.logFormSent = true
      return
    }
    else{
      this.authService.signIn(this.g.email.value, this.g.password.value)
    }
  }


  loginGoogle() {
    this.authService.googleAuth().then(_success => {
      document.getElementById('modalCloseLogin')?.click()
      document.getElementById('modalCloseRegister')?.click()
      this.notifier.notify('success', 'Acceso realizado')
      setTimeout(() => {
        this.router.navigate(['/home'])
      }, 1000);
    }).catch(_error => {
      this.notifier.notify('error', 'Error en el acceso')
    })
  }


  loginFb() {
    this.authService.loginWithFB().then(_success => {
      document.getElementById('modalCloseLogin')?.click()
      document.getElementById('modalCloseRegister')?.click()
      this.router.navigate(['/home'])
    }).catch(_error => {
      this.notifier.notify('error', 'Error en el acceso')
    })
  }

  toggleFbDev() {
    document.getElementById('modalCloseLogin')?.click()
    document.getElementById('modalCloseRegister')?.click()
    setTimeout(() => {
      document.getElementById('hiddenFbButton')?.click()
    }, 100);
  }
}
