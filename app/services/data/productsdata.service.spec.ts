import { TestBed } from '@angular/core/testing';

import { ProductsdataService } from './productsdata.service';

describe('ProductsdataService', () => {
  let service: ProductsdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
