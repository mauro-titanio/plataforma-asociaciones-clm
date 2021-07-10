import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-association-profile',
  templateUrl: './association-profile.component.html',
  styleUrls: ['./association-profile.component.scss']
})
export class AssociationProfileComponent implements OnInit {
vh:number = 0
vw:number = 0

  constructor() { 
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }

  ngOnInit(): void {
  }

}
