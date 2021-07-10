import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
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
    description:'',
    objectives: '',
    activities: '',
    profileImage:'',
    profileCover:'',
  }
 assForm: FormGroup
  aTypes= ['de vecinos', 'de madres y padres de alumnos', 'cultural', 'juvenil', 'entidad prestadora de servicios a la juventud', 'recreativa', 'deportiva', 'ideológica', 'de la tercera edad', 'de acción sanitaria', 'de acción social', 'referida a la Mujer', 'de profesionales', 'económica']
  associationTypes = this.aTypes.sort()
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private router: Router,
    private notifier: NotifierService, private fb: FormBuilder,
  ) { 
    this.readAssociations()
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.assForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(400)]],
      objectives: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(400)]],
      activities: ['', [Validators.minLength(3), Validators.maxLength(400)]],
      type: ['', Validators.required],
      profileImage: [''],
      profileCover: [''],
      facebook: ['', Validators.pattern(reg)],
      instagram: ['', Validators.pattern(reg)],
      twitter: ['', Validators.pattern(reg)],
      linkedin: ['', Validators.pattern(reg)],
      website: ['', Validators.pattern(reg)],
      telephone: [''],
      address: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],

    })
   }

  ngOnInit(): void {
    this.user = this.authService.userData()
  }
 
  get f() {
    return this.assForm.controls
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
    }, 100);
    setTimeout(() => {
      this.readThisAssociation()
    }, 1100);
  }




readThisAssociation() {
  this.crudAssociation.getAssociation(this.user.uid, this.userAssociation[0].id).subscribe((data: any) => {
    this.association = data.data()
    this.association.id = data.id
    console.log("Esta es la primera associación del array: ", this.association)
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
    description:this.association.description,
    objectives: this.association.objectives,
    activities: this.association.activities,
    profileImage:this.association.profileImage,
    profileCover:this.association.profileCover,
    })
  })
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
    website: this.f.website.value,
    facebook: this.f.facebook.value,
    twitter: this.f.twitter.value,
    instagram: this.f.instagram.value,
    linkedin: this.f.linkedin.value,
  }
 
  if (this.assForm.invalid) {
    this.notifier.notify('error', 'No se ha podido actualizar');
    console.log("error!")
    return
  }
  this.crudAssociation.updateAssociation(this.user.uid, association, this.association.id).then(success => {
    this.notifier.notify('success', 'Perfil actualizado');
    console.log("Post creado", success)
    setTimeout(() => {
      this.router.navigate(['/profile', (this.user.uid ),(this.association.id)]);
    }, 1000);
  }).catch(error => {
    this.notifier.notify('error', 'Ha habido un error en el servidor');
    console.log("Error", error)
  })
}







}
