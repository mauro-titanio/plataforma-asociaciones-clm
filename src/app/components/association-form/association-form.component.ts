import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Association } from 'src/app/shared/models/association';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';


@Component({
  selector: 'app-association-form',
  templateUrl: './association-form.component.html',
  styleUrls: ['./association-form.component.scss']
})
export class AssociationFormComponent implements OnInit {

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
    profileCover: '',
  }
  assForm: FormGroup
  aTypes = ['Asociación de vecinos', 'AMPA', 'Asociación cultural', 'Asociación juvenil', 'EPSJ', 'Asociación recreativa', 'Asociación deportiva', 'Asociación ideológica', 'Asociación de la tercera edad', 'Asociación de acción sanitaria', 'Asociación de acción social', 'Asociación referida a la Mujer', 'Asociación de profesionales', 'Asociación económica', 'LGTBI']
  associationTypes = this.aTypes.sort()
  uploadPercent: Observable<any> | undefined;
  downloadURL: Observable<any> | undefined;
  percentCover: any
  percent: any
  vh: number = 0
  vw: number = 0

  
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private router: Router,
    private notifier: NotifierService,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.assForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      objectives: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      activities: ['', [Validators.minLength(20), Validators.maxLength(1000)]],
      type: ['', Validators.required],
      profileImage: [''],
      profileCover: [''],
      facebook: ['',/* Validators.pattern(reg)*/],
      instagram: ['', /* Validators.pattern(reg)*/],
      twitter: ['', /* Validators.pattern(reg)*/],
      linkedin: ['',/* Validators.pattern(reg)*/],
      website: [''],
      telephone: [0],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    this.user = this.authService.userData()
    this.readAssociations()
  }


  get f() {
    return this.assForm.controls
  }


  readAssociations() {
    setTimeout(() => {
      this.crudAssociation.readAllAssociation(this.user.uid).subscribe(data => {
        this.userAssociation = []
        data.forEach((doc: any) => {
          let association: Association = doc.data()
          association.id = doc.id
          this.userAssociation.push(association)
        })
      })
    }, 100);
    setTimeout(() => {
      this.readThisAssociation()
    }, 1100);
  }


  readThisAssociation() {
    this.crudAssociation.getAssociation(this.user.uid, this.userAssociation[0].id).subscribe((data: any) => {
      this.association = data.data()
      this.association.id = data.id
      this.assForm.patchValue({
        id: this.association.id,
        author: this.user.uid,
        name: this.association.name,
        type: this.association.type,
        address: this.association.address,
        website: this.association.website,
        telephone: this.association.telephone,
        email: this.association.email,
        facebook: this.association.facebook,
        instagram: this.association.instagram,
        twitter: this.association.twitter,
        linkedin: this.association.linkedin,
        description: this.association.description,
        objectives: this.association.objectives,
        activities: this.association.activities,
        profileImage: this.association.profileImage,
        profileCover: this.association.profileCover,
      })
    })
  }


  uploadProfileImage(event: any) {
    const file = event.target.files[0];
    const filePath = Date.now() + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file)
    // observe percentage changes
    task.percentageChanges().subscribe(number => {
      this.percent = number!
    })
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(data => {
          this.assForm.patchValue({
            profileImage: data
          })
          this.association.profileImage = data
        })
      })
    )
      .subscribe()
  }


  uploadProfileCover(event: any) {
    const file = event.target.files[0];
    const filePath = Date.now() + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file)
    // observe percentage changes
    task.percentageChanges().subscribe(number => {
      this.percentCover = number!
    })
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(data => {
          this.assForm.patchValue({
            profileCover: data
          })
          this.association.profileCover = data
        })
      })
    )
      .subscribe()
  }


  navTab() {
    let first = document.getElementById('pills-home-tab')
    let second = document.getElementById('pills-profile-tab')
    if (first?.classList.contains('active')) {
      document.getElementById('pills-profile-tab')?.click()
      window.scrollTo(0, 0)
    } else if (second?.classList.contains('active')) {
      document.getElementById('pills-contact-tab')?.click()
      window.scrollTo(0, 0)
    }
  }


  updateProfile() {
    let association: Association = {
      id: this.association.id,
      name: this.f.name.value,
      type: this.f.type.value,
      author: this.association.author,
      description: this.f.description.value,
      objectives: this.f.objectives.value,
      activities: this.f.activities.value,
      profileImage: this.f.profileImage.value,
      profileCover: this.f.profileCover.value,
      address: this.f.address.value,
      telephone: this.f.telephone.value,
      email: this.f.email.value,
      website: this.addhttp(this.f.website.value),
      facebook: this.addhttpFb(this.f.facebook.value),
      twitter: this.addhttpTw(this.f.twitter.value),
      instagram: this.addhttpIg(this.f.instagram.value),
      linkedin: this.addhttpLkdn(this.f.linkedin.value),
    }
    if (this.assForm.invalid) {
      this.notifier.notify('error', 'No se ha podido actualizar');
      return
    }
    this.crudAssociation.updateAssociation(this.user.uid, association, this.association.id).then(success => {
      this.notifier.notify('success', 'Perfil actualizado');
      setTimeout(() => {
        this.router.navigate(['/profile', (this.user.uid), (this.association.id)]);
      }, 1000);
    }).catch(error => {
      this.notifier.notify('error', 'Ha habido un error en el servidor');
    })
  }


  addhttp(url: any) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://" + url;
    }
    return url;
  }


  addhttpFb(url: any) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://www.facebook.com/" + url;
    }
    return url;
  }


  addhttpLkdn(url: any) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://www.linkedin.com/in/" + url;
    }
    return url;
  }


  addhttpTw(url: any) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://twitter.com/" + url;
    }
    return url;
  }


  addhttpIg(url: any) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://www.instagram.com/" + url;
    }
    return url;
  }


}
