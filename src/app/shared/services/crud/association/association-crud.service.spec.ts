import { TestBed } from '@angular/core/testing';

import { AssociationCrudService } from './association-crud.service';

describe('AssociationCrudService', () => {
  let service: AssociationCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociationCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
