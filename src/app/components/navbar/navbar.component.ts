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
  configForm : FormGroup
  percent: any
  uploadPercent: Observable<any> | undefined;
  downloadURL: Observable<any> | undefined;
  constructor(
    private authService: AuthService,
    private crudAssociation: AssociationCrudService,
    private crudUsers: UsersCrudService,
    private router: Router,
    private notifier: NotifierService,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.configForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      photoURL: [''],
    })
    this.user = this.authService.userData()
    console.log("Usuario: ", this.authService.userData())
    this.readAssociations()
  }

  ngOnInit(): void {

  }
  get c() {
    return this.configForm.controls
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
      this.router.navigate(['/home'])
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha ocurrido un error en el servidor');
    })
  }

  
  logout() {
    this.authService.signOut()
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
