import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

import { WishListItem } from './wishlist.mode';
import { Product } from '../../products/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistproductBehSubject = new BehaviorSubject<Product[]>([]);
  wishlistproduct$ = this.wishlistproductBehSubject.asObservable();

  authService = inject(AuthService);

  constructor() {
    this.loadWishList();
  }

  isInWishList(id: number) {
    const currentWishList = this.wishlistproductBehSubject.value;
    return currentWishList.some((p) => p.id === id);
  }

  getStorageKey() {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    return currentUser ? `wishlist_${currentUser.id}` : 'wishlist_guest';
  }

  addToWishList(product: Product) {
    const key = this.getStorageKey();

    const currentWishList = this.wishlistproductBehSubject.value;

    if (this.isInWishList(product.id)) {
      return;
    }
    const updatedWishList = [...currentWishList, product];
    localStorage.setItem(key, JSON.stringify(updatedWishList));
    this.wishlistproductBehSubject.next(updatedWishList);
  }

  removeFromWishList(id: number) {
    const key = this.getStorageKey();
    const currentWishList = this.wishlistproductBehSubject.value;
    const newWishList = currentWishList.filter((p) => p.id !== id);

    localStorage.setItem(key, JSON.stringify(newWishList));
    this.wishlistproductBehSubject.next(newWishList);
  }

  loadWishList() {
    const key = this.getStorageKey();
    const savedWishLIst = localStorage.getItem(key);
    if (!savedWishLIst) {
      this.wishlistproductBehSubject.next([]);
      return;
    }

    const parsedWishList = JSON.parse(savedWishLIst) as Product[];
    this.wishlistproductBehSubject.next(parsedWishList);
  }
}
