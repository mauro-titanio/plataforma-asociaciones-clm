import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { NotifierService } from 'angular-notifier';
import { async } from 'rxjs';
import { Association } from 'src/app/shared/models/association';
import { Offer } from 'src/app/shared/models/offer';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';
import { OfferCrudService } from 'src/app/shared/services/crud/offer/offer-crud.service';
import { UsersCrudService } from 'src/app/shared/services/crud/users/users-crud.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss']
})
export class OffersListComponent implements OnInit {
  pageLoaded: boolean = false
  vw: number = 0
  openSearchFilters = false
  selectedType = { id: 0, name: '' }
  selection?: { id: number, name: string }
  searchText = ''
  searchProvince!: string
  selectedProvince: any
  provinces = [{ id: 1, name: 'Albacete' }, { id: 2, name: 'Ciudad Real' }, { id: 3, name: 'Cuenca' }, { id: 4, name: 'Guadalajara' }, { id: 5, name: 'Toledo' }]
  //
  users: Array<User> = []
  offers: Array<Offer> = []
  offer: Offer = {
    id: '',
    title: '',
    description: '',
    author: '',
    associationId: '',
    associationName: '',
    active: true,
    date: 0,
    zone: ''
  }
  // new Date().toDateString()
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService,
    private notifier: NotifierService,
    private crudOffers: OfferCrudService
  ) {
    this.readUsers()
    setTimeout(() => {
      this.readOffers()
    }, 1000);
    setTimeout(() => {
      this.pageLoaded = true
    }, 2500);
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) 
  }

  ngOnInit(): void {
    
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



  readOffers() {
    this.offers = []
    this.users.forEach((us) => {
      this.crudOffers.readAllOffers(us.uid).subscribe(data => {
        this.offers = []
        setTimeout(() => {
          data.forEach((doc: any) => {
            let off: Offer = doc.data()
            off.id = doc.id
            this.offers.push(off)
          }, 1500);
        })
      })
    });
    setTimeout(() => {
      this.offers.sort(function (a, b) {
        return a.date - b.date
      })
    }, 1000);
    
  }




  toggleSearchFilters() {
    if (!this.openSearchFilters) {
      this.openSearchFilters = true
    } else {
      this.openSearchFilters = false
    }
  }



  searchByProvince() {
    if (this.selectedProvince == null) {
      this.searchProvince = ''
    } else {
      this.searchProvince = this.selectedProvince.name
    }
  }
}
