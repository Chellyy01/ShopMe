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

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(`${this.baseUrl}/products`)
      .pipe(map((response) => response.products));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}
