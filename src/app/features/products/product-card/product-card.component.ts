import { Component, inject, Input } from '@angular/core';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart/services/cart.service';
import { WishlistService } from '../../wishlist/services/wishlist.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  onImageError(event: any) {
    event.target.src = 'https://placehold.co/400x300?text=No+Image';
  }

  cartService = inject(CartService);
  wishListService = inject(WishlistService);
  toastService = inject(ToastService);

  onAddToCartClicked(product: Product) {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.title} added to cart`);
  }

  addToWishList(product: Product) {
    if (this.wishListService.isInWishList(product.id)) {
      this.toastService.show(
        `${product.title} is already in your wishlist`,
        'info',
      );
      return;
    }

    this.wishListService.addToWishList(product);
    this.toastService.show(`${product.title} added to wishlist`);
  }

  isInWishList(productId: number) {
    return this.wishListService.isInWishList(productId);
  }
}
