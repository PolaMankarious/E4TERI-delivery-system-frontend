import { TestBed } from '@angular/core/testing';
import { AdminOrdersService } from './admin-orders';

describe('AdminOrders', () => {
  let service: AdminOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
