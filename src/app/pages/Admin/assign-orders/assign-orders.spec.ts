import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignOrders } from './assign-orders';

describe('AssignOrders', () => {
  let component: AssignOrders;
  let fixture: ComponentFixture<AssignOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
