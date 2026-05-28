import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../product.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  productService = inject(ProductService);
  cartService = inject(CartService);
  activeRoute = inject(ActivatedRoute);
  isloading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    const productId = this.activeRoute.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (data) => {
          this.product = data;
          this.getRelatedProducts(this.product.category);
          // console.log(this.getRelatedProducts(this.product.category));
        },
        error: (error) => {
          this.errorMessage = 'Failed to load product details.';
        },
        complete: () => {
          this.isloading = false;
        },
      });
    }
  }

  // getRatingStars(rate: number): string {
  //   const fullStars = Math.floor(rate);
  //   const halfStar = rate - fullStars >= 0.5 ? 1 : 0;
  //   const emptyStars = 5 - fullStars - halfStar;
  //   return (
  //     '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
  //   );
  // }

  getRelatedProducts(category: string | null): void {
    if (!category) return;
    this.productService.getProductsByCategory(category).subscribe({
      next: (data) => {
        this.relatedProducts = data.products.filter(
          (p) => p.id !== this.product?.id,
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onImageError(event: any) {
    event.target.src = 'https://placehold.co/400x300?text=No+Image';
  }

  getDiscountedPrice(product: Product): number {
    if (!product) return 0;

    return product.price - (product.discountPercentage / 100) * product.price;
  }

  onAddToCartClicked(product: any) {
    this.cartService.addToCart(product, 1);
    console.log('Added to cart:', product);
  }
}
