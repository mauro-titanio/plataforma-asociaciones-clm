import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'src/app/shared/models/association';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';

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
  userAssociation: Array<Association> = []
  association: Association = {
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
    profileCover: ''
  }
  associationExist = false
  pageLoaded: boolean = false
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private router: Router
  ) {
    this.user = this.authService.userData()

    this.readAssociations()
  }

  ngOnInit(): void {

  }


  createAssociation() {
    const association: Association = {
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
      profileCover: '',
      profileImage: ''
    }
    this.crudAssociation.newAssociation(association, this.user.uid).then(success => {
      console.log("Post creado", success)
    }).catch(error => {
      console.log("Error", error)
    })
    this.readAssociations()
    setTimeout(() => {
      this.router.navigate(['/create', (this.userAssociation[0].id)]);
    }, 1000);

  }

  readAssociations() {
    setTimeout(() => {
      this.crudAssociation.readAllAssociation(this.user.uid).subscribe(data => {
        this.userAssociation = []
        console.log("hola")
        data.forEach((doc: any) => {
          let association: Association = doc.data()
          association.id = doc.id
          this.userAssociation.push(association)
          console.log("read associations: ", this.userAssociation)
        })
      })
    }, 50);
    setTimeout(() => {
      this.thereIsAssociation()
      this.pageLoaded = true
    }, 1500);
  }


  thereIsAssociation() {
    if (this.userAssociation.length > 0) {
      this.associationExist = true
    } else {
      this.associationExist = false
    }
  }

  logout() {
    this.authService.signOut()
  }
}
