import { Component, inject } from '@angular/core';
import { WishlistService } from './services/wishlist.service';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishListService = inject(WishlistService);
  toastService = inject(ToastService);
  wishList$ = this.wishListService.wishlistproduct$;

  removeWish(id: number) {
    const product = this.wishListService.wishlistproductBehSubject.value.find(
      (item) => item.id === id,
    );

    this.wishListService.removeFromWishList(id);
    if (product) {
      this.toastService.show(`${product.title} removed from wishlist`, 'info');
    }
  }
}
