import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/shared/models/association';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-association-profile',
  templateUrl: './association-profile.component.html',
  styleUrls: ['./association-profile.component.scss']
})
export class AssociationProfileComponent implements OnInit {
  vh: number = 0
  vw: number = 0
  userId: string
  assId: string
  association: Association = {
    id: '',
    author: '',
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
  user: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: true
  }
  sameUser: boolean = false
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crudAssociation: AssociationCrudService,
    private authService: AuthService,
    private _location: Location
  ) {
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    this.userId = this.route.snapshot.paramMap.get('userID') ?? ""
    this.assId = this.route.snapshot.paramMap.get('assID') ?? ""
    this.crudAssociation.getAssociation(this.userId, this.assId).subscribe(data => {
      this.association = data.data() as Association
      this.association.id = data.id
      console.log(this.association)
    })
    this.user = this.authService.userData()
  
  }

  isTheSameUser() {
    if (this.user.uid == this.userId) {
      this.sameUser = true
    } else{
      this.sameUser = false
    }
    
  }

  ngOnInit(): void {
    this.isTheSameUser()
    console.log("Same user?")
  }
  goBack() {
    this._location.back();
  }
}
