import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem, CartProduct } from '../model/cart.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  http = inject(HttpClient);
  baseUrl: string = environment.apiUrl;

  cartbehaviorSubject = new BehaviorSubject<CartItem | null>(null);
  cart$ = this.cartbehaviorSubject.asObservable();

  //total number of items in the cart
  cartCount$ = this.cart$.pipe(
    map((cart) => cart?.products.reduce((count, product) => count + product.quantity, 0) ?? 0)
  );

  //total price of items in the cart
  cartTotal$ = this.cart$.pipe(
    map((cart) => cart?.total ?? 0)
  );

  addToCart(product: CartProduct, quantity: number) {
    const currentCart = this.cartbehaviorSubject.value;
    if(!currentCart) {
      const newCart: CartItem = {
        id: Date.now(), // Generate a unique ID for the cart item
        products: [{
          ...product,
          quantity
        }],
        total: product.price * quantity,
        userId: 1 // Replace with actual user ID
      };
      this.cartbehaviorSubject.next(newCart);
    } else {
      const existingProduct = currentCart.products.find(p => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
      const updatedCart: CartItem = {
        ...currentCart,
        products: [...currentCart.products, { ...product, quantity }],
        total: currentCart.total + product.price * quantity
      };
      this.cartbehaviorSubject.next(updatedCart);
    }
    }

  }
}
