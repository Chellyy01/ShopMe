import { Component, inject } from '@angular/core';
import { WishlistService } from './services/wishlist.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishListService = inject(WishlistService);
  wishList$ = this.wishListService.wishlistproduct$;

  removeWish(id: number) {
    this.wishListService.removeFromWishList(id);
  }
}
