import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { NotifierService } from 'angular-notifier';
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


  selectedType = { id: 0, name: '' }
  selection?: { id: number, name: string }
  searchText = ''
  searchProvince!: string
  selectedProvince: any
  provinces = [{ id: 1, name: 'Albacete' }, { id: 2, name: 'Ciudad Real' }, { id: 3, name: 'Cuenca' }, { id: 4, name: 'Guadalajara' }, { id: 5, name: 'Toledo' }]
  aTypes = [{ id: 1, name: 'Asociación de vecinos' }, { id: 2, name: 'AMPA' }, { id: 3, name: 'Asociación cultural' }, { id: 4, name: 'Asociación juvenil' }, { id: 5, name: 'EPSJ' }, { id: 6, name: 'Asociación recreativa' }, { id: 7, name: 'Asociación deportiva' }, { id: 8, name: 'Asociación ideológica' }, { id: 9, name: 'Asociación de la tercera edad' }, { id: 10, name: 'Asociación de acción sanitaria' }, { id: 11, name: 'Asociación de acción social' }, { id: 12, name: 'Asociación referida a la Mujer' }, { id: 13, name: 'Asociación de profesionales' }, { id: 14, name: 'Asociación económica' }]
  associationTypes = this.aTypes.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService,
    private notifier: NotifierService

  ) { }

  ngOnInit(): void {


    this.readUsers()
    setTimeout(() => {
      this.readAssociations()
    }, 3000);


  }









  readUsers() {
    this.crudUsers.readAllUsers().subscribe(data => {
      this.users = []
      data.forEach((doc: any) => {
        let user: User = doc.data()
        user.uid = doc.id
        this.users.push(user)
      })
    })
  }

  readAssociations() {
    this.associations = []
    this.pageLoaded = false
    this.users.forEach((us) => {
      this.crudAssociation.readAllAssociation(us.uid).subscribe(data => {
        this.associations = []
        setTimeout(() => {
          data.forEach((doc: any) => {
            let ass: Association = doc.data()
            ass.id = doc.id
            this.associations.push(ass)
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
    setTimeout(() => {
      this.pageLoaded = true
    }, 1000);
  }

  searchByType() {
    if (this.selection == null) {
      this.associations = []
      this.readAssociations()
      return
    }
    setTimeout(() => {
      let selectedType = {
        id: this.selection?.id,
        name: this.selection?.name
      }
      let filtered
      filtered = this.associations.filter(data => data.type === selectedType.name)
      if (filtered.length != 0) {
        this.associations = filtered
      }
      else {
        this.notifier.notify('error', 'No hemos encontrado asociaciones de esta tipología')
      }
    }, 500);
  }

  searchByProvince() {
    if (this.selectedProvince == null) {
      this.searchProvince = ''
    } else {
      this.searchProvince = this.selectedProvince.name
    }
  }








}
