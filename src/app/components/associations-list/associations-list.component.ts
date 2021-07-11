import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { Association } from 'src/app/shared/models/association';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';
import { UsersCrudService } from 'src/app/shared/services/crud/users/users-crud.service';

@Component({
  selector: 'app-associations-list',
  templateUrl: './associations-list.component.html',
  styleUrls: ['./associations-list.component.scss']
})
export class AssociationsListComponent implements OnInit {
users: Array<User> = []
associations: Array<Association> = []
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService
   
  ) {
    this.readUsers()
   }

  ngOnInit(): void {
  }


  readUsers() {
      this.crudUsers.readAllUsers().subscribe(data => {
        this.users = []
        console.log("hola")
        data.forEach((doc: any) => {
          let user: User = doc.data()
          user.uid = doc.id
          this.users.push(user)
          console.log("Listado de usuarios: ", this.users)
        })
      })
      setTimeout(() => {
        this.readAssociations()
      }, 1000);
  }

  readAssociations(){
    this.users.forEach((user:User)=>{
      this.crudAssociation.readAllAssociation(user.uid).subscribe(data => {
        this.associations = []
        console.log("hola")
        data.forEach((doc: any) => {
          let association: Association = doc.data()
          association.id = doc.id
          this.associations.push(association)
          console.log("read associations: ", this.associations)
        })
      })
    })
    
  }





}
