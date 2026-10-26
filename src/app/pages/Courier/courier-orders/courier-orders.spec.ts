import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourierOrders } from './courier-orders';

describe('CourierOrders', () => {
  let component: CourierOrders;
  let fixture: ComponentFixture<CourierOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(CourierOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
