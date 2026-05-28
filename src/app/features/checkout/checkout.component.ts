import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../cart/services/cart.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  fb = inject(FormBuilder);
  cartService = inject(CartService);
  cart$ = this.cartService.cart$;
  cartTotal$ = this.cartService.cartTotal$;

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    paymentMethod: ['', Validators.required],
  });

  onCheckoutFormSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const cart = this.cartService.cartbehaviorSubject.value;
    if (!cart || cart.products.length === 0) {
      return;
    }

    const order = {
      id: Date.now(),
      customer: this.checkoutForm.value,
      products: cart.products,
      total: cart.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log(order);
    this.saveOrderForCurrentUser(order);
  }

  saveOrderForCurrentUser(order: any) {
    const currentUser =
      this.cartService.authService.currentUserBehaviorSubject.value;
    if (!currentUser) return;

    const orderKey = `shopme-orders-user-${currentUser?.id}`;
    const savedOrders = localStorage.getItem(orderKey);

    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    orders.push(order);

    localStorage.setItem(orderKey, JSON.stringify(orders));
  }
}
