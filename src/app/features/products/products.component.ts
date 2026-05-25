import { Component, inject, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './services/product.service';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isloading: boolean = true;
  errorMessage: string = '';

  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isloading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isloading = false;
      },
    });
  }
}
