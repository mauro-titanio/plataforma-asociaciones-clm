import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  user: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: true
  }
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.userData()
    console.log(this.user)
  }





  logout() {
    this.authService.signOut()
  }
}
