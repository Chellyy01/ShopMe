import { Component, inject, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './services/product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  total!: number;
  limit: number = 10;
  skip: number = 0;
  currentPage: number = 1;
  isloading: boolean = true;
  errorMessage: string = '';
  categories: any[] = [];
  activeCategory = 'all';
  activeSort = 'default';

  productService = inject(ProductService);
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.loadCategories();
    this.activeRoute.queryParamMap.subscribe((params) => {
      const search = params.get('search');
      const category = params.get('category');
      const sortBy = params.get('sortBy');
      const order = params.get('order');

      this.activeCategory = category ?? 'all';
      this.activeSort = sortBy && order ? `${sortBy}-${order}` : 'default';

      if (search) {
        this.loadSearchProducts(search);
      } else if (category) {
        this.loadProductsByCategory(category);
      } else if (sortBy && order) {
        this.loadSortedProducts(sortBy, order);
      } else {
        this.getAllProducts();
      }
    });
  }

  getAllProducts() {
    this.isloading = true;
    this.errorMessage = '';
    this.productService.getProducts(this.limit, this.skip).subscribe({
      next: (data) => {
        this.products = data.products;
        this.total = data.total;
        this.isloading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isloading = false;
      },
    });
  }

  loadSearchProducts(search: string) {
    this.isloading = true;
    this.errorMessage = '';
    this.productService
      .searchProducts(search, this.limit, this.skip)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.total = data.total;
          this.isloading = false;
        },
        error: (error) => {
          this.errorMessage =
            'Failed to load products. Please try again later.';
          this.isloading = false;
        },
      });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.errorMessage = 'Something went wrong';
      },
    });
  }

  loadProductsByCategory(category: string) {
    this.isloading = true;
    this.errorMessage = '';
    this.productService
      .getProductsByCategory(category, this.limit, this.skip)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.total = data.total;
          this.isloading = false;
        },
        error: (err) => {
          this.errorMessage = 'Something went wrong';
          this.isloading = false;
        },
      });
  }

  onCategoryClicked(category: string) {
    this.skip = 0;
    this.currentPage = 1;
    this.router.navigate(['/products'], { queryParams: { category } });
    this.activeCategory = category;
  }

  onAllClicked() {
    this.skip = 0;
    this.currentPage = 1;
    this.router.navigate(['/products']);
    this.activeCategory = 'all';
  }

  onNextBtnClicked() {
    if (this.limit + this.skip >= this.total) return;

    this.skip += this.limit;
    this.currentPage += 1;
    this.reloadCurrentProducts();
  }

  onPrevBtnClicked() {
    if (this.skip === 0) return;
    this.skip -= this.limit;
    this.currentPage -= 1;
    this.reloadCurrentProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  onSortChanged(event: Event) {
    this.skip = 0;
    this.currentPage = 1;
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'default') {
      this.router.navigate(['/products']);
      return;
    }

    const [sortBy, order] = value.split('-');
    this.router.navigate(['/products'], {
      queryParams: { sortBy, order },
    });
  }

  loadSortedProducts(sortBy: string, order: string) {
    this.isloading = true;
    this.errorMessage = '';

    this.productService
      .getSortedProducts(sortBy, order, this.limit, this.skip)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.total = data.total;
          this.isloading = false;
        },
        error: () => {
          this.errorMessage = 'failed';
          this.isloading = false;
        },
      });
  }

  reloadCurrentProducts() {
    const sortBy = this.activeRoute.snapshot.queryParamMap.get('sortBy');
    const order = this.activeRoute.snapshot.queryParamMap.get('order');
    const category = this.activeRoute.snapshot.queryParamMap.get('category');
    const search = this.activeRoute.snapshot.queryParamMap.get('search');

    if (search) {
      this.loadSearchProducts(search);
    } else if (category) {
      this.loadProductsByCategory(category);
    } else if (sortBy && order) {
      this.loadSortedProducts(sortBy, order);
    } else {
      this.getAllProducts();
    }
  }
}
