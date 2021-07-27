import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Offer } from 'src/app/shared/models/offer';
import { OfferCrudService } from 'src/app/shared/services/crud/offer/offer-crud.service';

@Component({
  selector: 'app-offers-dashboard',
  templateUrl: './offers-dashboard.component.html',
  styleUrls: ['./offers-dashboard.component.scss']
})
export class OffersDashboardComponent implements OnInit {
  userId: string = ''
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
    zone: '',
    image:''
  }
  oForm: FormGroup
  offerCreated = false

  
  constructor(
    private route: ActivatedRoute,
    private crudOffers: OfferCrudService,
    private notifier: NotifierService,
    private fb: FormBuilder,
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? ""
    this.oForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    })
  }

  ngOnInit(): void {
    this.readAllOffers()
  }

  get v() {
    return this.oForm.controls
  }

  readAllOffers() {
    setTimeout(() => {
      this.crudOffers.readAllOffers(this.userId).subscribe(data => {
        this.offers = []
        data.forEach((doc: any) => {
          let o: Offer = doc.data()
          o.id = doc.id
          this.offers.push(o)
        })
      })
    }, 1000);
    this.offers.sort(function (a, b) {
      return a.date - b.date
    })
  }


  getOffer(id: string) {
    this.offerCreated = false
    this.crudOffers.getOffer(this.userId, id).subscribe((data: any) => {
      this.offer = data.data()
      this.offer.id = data.id
      this.oForm.patchValue({
        id: id,
        date: new Date().getTime(),
        title: this.offer.title,
        description: this.offer.description,
        author: this.userId,
        associationId: this.offer.associationId,
        associationName: this.offer.associationName,
        active: true,
        image: this.offer.image,
        zone: this.offer.zone
      })
    })
  }

  deleteOffer(id: any) {
    this.crudOffers.deleteOffer(this.userId, id).then(success => {
      this.notifier.notify('success', 'Oferta eliminada');
      this.readAllOffers()
      document.getElementById('closeDeleteOffer')?.click()
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha ocurrido un error en el servidor');
    })
  }

  updateOffer() {
    let o: Offer = {
      id: this.offer.id,
      date: new Date().getTime(),
      title: this.v.title.value,
      description: this.v.description.value,
      author: this.userId,
      associationId: this.offer.associationId,
      associationName: this.offer.associationName,
      active: true,
      image: this.offer.image,
      zone: this.offer.zone
    }
    if (this.oForm.invalid) {
      this.notifier.notify('error', 'No se ha podido actualizar');
      return
    }
    this.crudOffers.updateOffer(this.userId, o, o.id).then(success => {
      this.notifier.notify('success', 'Oferta actualizada');
      setTimeout(() => {
        this.offerCreated = true
      }, 100);
      this.readAllOffers()
    }).catch(error => {
      this.notifier.notify('error', 'Ha ocurrido un error en el servidor');
    })
  }

}
