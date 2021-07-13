import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Association } from 'src/app/shared/models/association';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: true
  }
  userAss: Array<Association> = []
  ass: Association = {
    id: '',
    author: this.user.uid,
    name: '',
    type: '',
    address: '',
    website: '',
    telephone: 0,
    email: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    description: '',
    objectives: '',
    activities: '',
    profileImage: '',
    profileCover: '',
  }
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private router: Router,
    private notifier: NotifierService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.userData()
    console.log("user", this.user)
    this.readAssociations()
  }


  vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  readAssociations() {
    setTimeout(() => {
      this.crudAssociation.readAllAssociation(this.user.uid).subscribe(data => {
        this.userAss = []
        data.forEach((doc: any) => {
          let association: Association = doc.data()
          association.id = doc.id
          this.userAss.push(association)
          console.log("read associations: ", this.userAss)
        })
      })
    }, 100);
    setTimeout(() => {
      this.readThisAssociation()
    }, 1100);
  }

  readThisAssociation() {
    this.crudAssociation.getAssociation(this.user.uid, this.userAss[0].id).subscribe((data: any) => {
      this.ass = data.data()
      this.ass.id = data.id
      console.log("Esta es la primera associación del array: ", this.ass)
    })
  }
  
  deleteAss() {
    this.crudAssociation.deleteAssociation(this.user.uid, this.ass.id).then(success => {
      this.notifier.notify('success', 'Perfil eliminado');
      document.getElementById('closeDelete')?.click()
      this.router.navigate(['/home'])
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha habido un error en el servidor');
    })
  }
  logout() {
    this.authService.signOut()
  }
}
