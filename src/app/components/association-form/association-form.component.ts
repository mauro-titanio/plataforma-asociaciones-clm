import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-association-form',
  templateUrl: './association-form.component.html',
  styleUrls: ['./association-form.component.scss']
})
export class AssociationFormComponent implements OnInit {

  constructor() { 
    console.log(this.associationTypes)
   }

  ngOnInit(): void {
  }
  aTypes= ['de vecinos', 'de madres y padres de alumnos', 'cultural', 'juvenil', 'entidad prestadora de servicios a la juventud', 'recreativa', 'deportiva', 'ideológica', 'de la tercera edad', 'de acción sanitaria', 'de acción social', 'referida a la Mujer', 'de profesionales', 'económica']
associationTypes = this.aTypes.sort()
}
