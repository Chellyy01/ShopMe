import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
}
