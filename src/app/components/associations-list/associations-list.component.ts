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
  pageLoaded: boolean = false
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService

  ) {
    this.readUsers()
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pageLoaded = true
    }, 2000);
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

  readAssociations() {
    this.users.forEach((us) => {
      console.log(`${us.displayName} : ${us.uid}`);
      this.crudAssociation.readAllAssociation(us.uid).subscribe(data => {
        this.associations = []
        setTimeout(() => {
          data.forEach((doc: any) => {
            let association: Association = doc.data()
            association.id = doc.id
            console.log("Data: ", doc.data())
            this.associations.push(association)
            console.log("read associations: ", this.associations)
        }, 1000);
        })
      })
    });
    setTimeout(() => {
      this.associations.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    }, 1000);
    
  }





}
