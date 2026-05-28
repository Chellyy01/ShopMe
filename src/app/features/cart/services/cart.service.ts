import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { CartItem, CartProduct, CartsResponse } from '../model/cart.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../products/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}
  http = inject(HttpClient);
  baseUrl: string = environment.apiUrl;
  authService = inject(AuthService);

  cartbehaviorSubject = new BehaviorSubject<CartItem | null>(null);
  cart$ = this.cartbehaviorSubject.asObservable();

  //total number of items in the cart
  cartCount$ = this.cart$.pipe(
    map(
      (cart) =>
        cart?.products.reduce(
          (count, product) => count + product.quantity,
          0,
        ) ?? 0,
    ),
  );

  //total price of items in the cart
  cartTotal$ = this.cart$.pipe(map((cart) => cart?.total ?? 0));

  //Save user specific cart
  saveCartFromCurrentUser(cart: CartItem) {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    if (!currentUser) return;

    const storageKey = `shopme_cart_user_${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }

  //load saved cart for current user
  loadSavedCartForCurrentUser() {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    if (!currentUser) return;

    const storageKey = `shopme_cart_user_${currentUser.id}`;
    const savedCart = localStorage.getItem(storageKey);
    if (!savedCart) return;

    const parsedCart = JSON.parse(savedCart) as CartItem;
    this.cartbehaviorSubject.next(parsedCart);
  }

  //Add to cart
  addToCart(product: Product, quantity: number) {
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      total: product.price * quantity,
      discountPercentage: product.discountPercentage,
      discountedTotal:
        product.price * quantity -
        (product.discountPercentage / 100) * product.price * quantity,
      thumbnail: product.thumbnail,
    };

    const currentCart = this.cartbehaviorSubject.value;

    if (!currentCart) {
      const newCart: CartItem = {
        id: Date.now(), // Generate a unique ID for the cart item
        products: [cartProduct],
        total: product.price * quantity,
        userId: this.authService.currentUserBehaviorSubject.value?.id ?? 0,
      };
      this.cartbehaviorSubject.next(newCart);
      this.saveCartFromCurrentUser(newCart);
    } else {
      const existingProduct = currentCart.products.find(
        (p) => p.id === product.id,
      );
      if (existingProduct) {
        const updatedProducts = {
          ...currentCart,
          products: currentCart.products.map((p) => {
            if (p.id !== product.id) return p;
            const newQuantity = p.quantity + quantity;
            return {
              ...p,
              quantity: newQuantity,
              total: p.price * newQuantity,
              discountedTotal:
                p.price * newQuantity -
                (p.discountPercentage / 100) * p.price * newQuantity,
            };
          }),
          total: currentCart.total + product.price * quantity,
        };
        this.cartbehaviorSubject.next(updatedProducts);
        this.saveCartFromCurrentUser(updatedProducts);
      } else {
        const updatedProducts = {
          ...currentCart,
          products: [...currentCart.products, cartProduct],
          total: currentCart.total + product.price * quantity,
        };
        this.cartbehaviorSubject.next(updatedProducts);
        this.saveCartFromCurrentUser(updatedProducts);
      }
    }
  }

  //Update cart
  updateCartItem(productId: number, quantity: number) {
    const currentCart = this.cartbehaviorSubject.value;
    if (currentCart) {
      const productToUpdate = currentCart.products.find(
        (p) => p.id === productId,
      );
      if (productToUpdate) {
        const updatedProducts = currentCart.products.map((p) => {
          if (p.id !== productId) return p;

          const newQuantity = quantity;
          return {
            ...p,
            quantity: newQuantity,
            total: p.price * newQuantity,
            discountedTotal:
              p.price * newQuantity -
              (p.discountPercentage / 100) * p.price * newQuantity,
          };
        });
        const updatedCart = {
          ...currentCart,
          products: updatedProducts,
          total:
            currentCart.total +
            productToUpdate.price * (quantity - productToUpdate.quantity),
        };
        this.cartbehaviorSubject.next(updatedCart);
        this.saveCartFromCurrentUser(updatedCart);
      }
    }
  }

  decreaseQuantity(productId: number) {
    const currentCart = this.cartbehaviorSubject.value;
    if (currentCart) {
      const productToUpdate = currentCart.products.find(
        (p) => p.id === productId,
      );
      if (productToUpdate && productToUpdate.quantity > 1) {
        this.updateCartItem(productId, productToUpdate.quantity - 1);
      }
    }
  }

  increaseQuantity(productId: number) {
    const currentCart = this.cartbehaviorSubject.value;
    if (currentCart) {
      const productToUpdate = currentCart.products.find(
        (p) => p.id === productId,
      );
      if (productToUpdate) {
        this.updateCartItem(productId, productToUpdate.quantity + 1);
      }
    }
  }

  removeFromCart(productId: number) {
    const currentCart = this.cartbehaviorSubject.value;
    if (currentCart) {
      const productToRemove = currentCart.products.find(
        (p) => p.id === productId,
      );
      if (productToRemove) {
        const updatedProducts = currentCart.products.filter(
          (p) => p.id !== productId,
        );

        if (updatedProducts.length === 0) {
          this.cartbehaviorSubject.next(null);
          this.removeSavedCartForCurrentUser();
          return;
        }

        const updatedCart = {
          ...currentCart,
          products: updatedProducts,
          total:
            currentCart.total -
            productToRemove.price * productToRemove.quantity,
        };
        this.cartbehaviorSubject.next(updatedCart);
        this.saveCartFromCurrentUser(updatedCart);
      }
    }
  }

  removeSavedCartForCurrentUser() {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    if (!currentUser) return;

    const storageKey = `shopme_cart_user_${currentUser.id}`;
    localStorage.removeItem(storageKey);
  }

  clearCart() {
    this.cartbehaviorSubject.next(null);
  }

  loadCart(userId: number) {
    return this.http
      .get<CartsResponse>(`${this.baseUrl}/carts/user/${userId}`)
      .pipe(
        map((res) => {
          return res.carts[0] ?? null;
        }),
        tap((cart) => this.cartbehaviorSubject.next(cart)),
      );
  }
}
