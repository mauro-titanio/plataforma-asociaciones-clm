import { TestBed } from '@angular/core/testing';

import { OfferCrudService } from './offer-crud.service';

describe('OfferCrudService', () => {
  let service: OfferCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
