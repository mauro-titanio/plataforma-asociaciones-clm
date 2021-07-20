import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Association } from 'src/app/shared/models/association';
import { Feedback } from 'src/app/shared/models/feedback';
import { Offer } from 'src/app/shared/models/offer';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssociationCrudService } from 'src/app/shared/services/crud/association/association-crud.service';
import { OfferCrudService } from 'src/app/shared/services/crud/offer/offer-crud.service';
import { UsersCrudService } from 'src/app/shared/services/crud/users/users-crud.service';

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
  users: Array<User> = []
  vw: number = 0
  commentForm: FormGroup
  percent: any
  uploadPercent: Observable<any> | undefined;
  downloadURL: Observable<any> | undefined;
  feedback: Feedback = {
    id: 0,
    date: '',
    message: ''
  }
  feedbackSent = false
  offerForm: FormGroup


  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService,
    private crudOffers: OfferCrudService,
    private router: Router,
    private notifier: NotifierService,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    })
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    })
    this.user = this.authService.userData()
    this.readAssociations()
  }

  ngOnInit(): void { }


  get c() {
    return this.commentForm.controls
  }


  get o() {
    return this.offerForm.controls
  }


  readAssociations() {
    setTimeout(() => {
      this.crudAssociation.readAllAssociation(this.user.uid).subscribe(data => {
        this.userAss = []
        data.forEach((doc: any) => {
          let association: Association = doc.data()
          association.id = doc.id
          this.userAss.push(association)
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
    })
  }


  deleteAss() {
    this.crudAssociation.deleteAssociation(this.user.uid, this.ass.id).then(success => {
      this.notifier.notify('success', 'Perfil eliminado');
      document.getElementById('closeDelete')?.click()
      this.router.navigate([''])
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha ocurrido un error en el servidor');
    })
  }


  logout() {
    this.authService.signOut()
  }


  toggleFeedBack() {
    if (this.feedbackSent == true) {
      this.feedbackSent = false
    }
  }


  sendFeedBack() {
    const comment: Feedback = {
      id: new Date().getTime(),
      date: new Date().toDateString(),
      message: this.c.message.value
    }
    if (this.commentForm.invalid) {
      this.notifier.notify('error', 'Ha ocurrido un error');
      return
    }
    this.crudUsers.sendFeedback(this.user.uid, comment).then(success => {
      this.notifier.notify('success', 'Mensaje envíado');
      this.feedbackSent = true
      this.commentForm.patchValue({
        message: ''
      })
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha ocurrido un error');
    })
  }


  createOffer() {
    const off: Offer = {
      id: '',
      date: new Date().getTime(),
      title: this.o.title.value,
      description: this.o.description.value,
      author: this.user.uid,
      associationId: this.ass.id,
      associationName: this.ass.name,
      active: true,
      image: this.ass.profileImage,
      zone: this.ass.address
    }
    if (this.offerForm.invalid) {
      this.notifier.notify('error', 'Ha ocurrido un error');
      return
    }
    this.crudOffers.newOffer(this.user.uid, off).then(success => {
      this.notifier.notify('success', 'Oferta creada');
      this.feedbackSent = true
      this.offerForm.patchValue({
        title: '',
        description: ''
      })
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha ocurrido un error');
    })
  }


  refresh(): void {
    window.location.reload();
  }


  /*
    uploadUserProfileImage(event: any) {
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
            this.configForm.patchValue({
              profileImage: data
            })
            this.user.photoURL = data
          })
        })
      )
        .subscribe()
      }
  
      updateUserProfile() {
        let us: User = {
          uid: this.user.uid,
          email: this.user.email,
          displayName: this.c.displayName.value,
          photoURL: this.c.photoURL.value,
          emailVerified: this.user.emailVerified
        }
        if (this.configForm.invalid) {
          this.notifier.notify('error', 'No se ha podido actualizar');
          return
        }
        this.crudUsers.updateUser(this.user.uid, us).then(success => {
          this.notifier.notify('success', 'Perfil actualizado');
          console.log("Post creado", success)
        }).catch(error => {
          this.notifier.notify('error', 'Ha ocurrido un error en el servidor');
          console.log("Error", error)
        })
      }
      */


}
