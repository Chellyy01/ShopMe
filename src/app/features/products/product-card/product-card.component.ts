import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart/services/cart.service';
import { CartProduct } from '../../cart/model/cart.model';

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

  onAddToCartClicked(product: any) {
    this.cartService.addToCart(product, 1);
  }
}
