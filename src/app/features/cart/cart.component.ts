import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { CartService } from './services/cart.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  toastService = inject(ToastService);

  cart$ = this.cartService.cart$;
  cartCount$ = this.cartService.cartCount$;
  cartTotal$ = this.cartService.cartTotal$;

  removeFromCart(productId: number) {
    const product = this.cartService.cartbehaviorSubject.value?.products.find(
      (item) => item.id === productId,
    );

    this.cartService.removeFromCart(productId);
    if (product) {
      this.toastService.show(`${product.title} removed from cart`, 'info');
    }

    if (this.cartService.cartbehaviorSubject.value?.products.length === 0) {
      this.cartService.clearCart();
    }
  }

  clearCart() {
    this.cartService.clearCart();
    this.toastService.show('Cart cleared', 'info');
  }

  onMinusClicked(productId: number) {
    this.cartService.decreaseQuantity(productId);
  }

  onAddClicked(productId: number) {
    this.cartService.increaseQuantity(productId);
  }
}
