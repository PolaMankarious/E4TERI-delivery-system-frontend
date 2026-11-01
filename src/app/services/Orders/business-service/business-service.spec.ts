import { TestBed } from '@angular/core/testing';
import { BusinessOrdersService } from './business-service';

describe('BusinessService', () => {
  let service: BusinessOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
