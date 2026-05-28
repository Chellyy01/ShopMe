import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product, ProductsResponse } from '../product.model';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  baseUrl: string = environment.apiUrl;

  getProducts(
    limit: number = 10,
    skip: number = 0,
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products?limit=${limit}&skip=${skip}`,
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  searchProducts(
    query: string,
    limit: number = 10,
    skip: number = 0,
  ): Observable<ProductsResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products/search?q=${encodedQuery}&limit=${limit}&skip=${skip}`,
    );
  }

  getCategories() {
    return this.http.get<any[]>(`${this.baseUrl}/products/categories`);
  }

  getProductsByCategory(
    category: string,
    limit: number = 10,
    skip: number = 0,
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products/category/${category}?limit=${limit}&skip=${skip}`,
    );
  }

  getSortedProducts(
    sortBy: string,
    order: string,
    limit: number = 10,
    skip: number = 0,
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${skip}`,
    );
  }
}
