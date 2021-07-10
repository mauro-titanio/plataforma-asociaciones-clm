import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationProfileComponent } from './association-profile.component';

describe('AssociationProfileComponent', () => {
  let component: AssociationProfileComponent;
  let fixture: ComponentFixture<AssociationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
