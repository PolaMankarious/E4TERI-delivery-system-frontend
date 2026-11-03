import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BusinessOrdersService } from '../../../services/Orders/business-service/business-service';
import { CreateOrderRequest } from '../../../models/order';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-add-order',
  styleUrl: './add-order.css',
  templateUrl: './add-order.html',
})
export class AddOrder {
  private fb = inject(FormBuilder);
  private ordersService = inject(BusinessOrdersService);
  private router = inject(Router);

  submitting = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    pickup_address: ['', Validators.required],
    dropoff_address: ['', Validators.required],
    delivery_time: ['', Validators.required],
    package_name: ['', Validators.required],
    customer_name: ['', Validators.required],
    customer_number: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  // true when a field was touched and is invalid (used to show errors)
  showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const body: CreateOrderRequest = {
      order: {
        pickup_address: v.pickup_address,
        dropoff_address: v.dropoff_address,
        // the date input gives local time, the backend expects an ISO string
        delivery_time: new Date(v.delivery_time).toISOString(),
      },
      package: {
        package_name: v.package_name,
        customer_name: v.customer_name,
        customer_number: v.customer_number,
        price: v.price,
      },
    };

    this.submitting.set(true);
    this.errorMessage.set('');

    this.ordersService.createOrder(body).subscribe({
      next: () => this.router.navigate(['/my-orders']),
      error: (err) => {
        this.errorMessage.set(err.error?.data?.message ?? 'Could not create the order.');
        this.submitting.set(false);
      },
    });
  }
}