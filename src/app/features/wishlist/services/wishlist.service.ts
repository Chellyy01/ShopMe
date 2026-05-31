import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

import { WishListItem } from './wishlist.mode';
import { Product } from '../../products/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}
  wishlistproductBehSubject = new BehaviorSubject<Product[]>([]);
  wishlistproduct$ = this.wishlistproductBehSubject.asObservable();

  authService = inject(AuthService);

  isInWishList(id: number) {
    const currentWishList = this.wishlistproductBehSubject.value;
    return currentWishList.some((p) => p.id === id);
  }

  addToWishList(product: Product) {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    const key = `wishlist_${currentUser?.id}`;
    if (!currentUser) return;

    const currentWishList = this.wishlistproductBehSubject.value;

    if (this.isInWishList(product.id)) {
      return;
    }
    const updatedWishList = [...currentWishList, product];
    localStorage.setItem(key, JSON.stringify(updatedWishList));
    this.wishlistproductBehSubject.next(updatedWishList);
  }

  removeFromWishList(id: number) {
    const currenUser = this.authService.currentUserBehaviorSubject.value;
    const key = `wishlist_${currenUser?.id}`;
    const currentWishList = this.wishlistproductBehSubject.value;
    const newWishList = currentWishList.filter((p) => p.id !== id);

    localStorage.setItem(key, JSON.stringify(newWishList));
    this.wishlistproductBehSubject.next(newWishList);
  }

  loadWishList() {
    const currentUser = this.authService.currentUserBehaviorSubject.value;
    const key = `wishlist_${currentUser?.id}`;
    const savedWishLIst = localStorage.getItem(key);
    if (!savedWishLIst) return;

    const parsedWishList = JSON.parse(savedWishLIst) as Product[];
    this.wishlistproductBehSubject.next(parsedWishList);
  }
}
