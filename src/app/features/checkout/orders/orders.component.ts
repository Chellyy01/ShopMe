import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  orders: any[] = [];
  // orderId: string = '';

  ngOnInit() {
    const currentUser = this.authService.currentUserBehaviorSubject.value;

    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    const orderKey = `shopme-orders-user-${currentUser.id}`;
    const savedOrders = localStorage.getItem(orderKey);

    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      this.orders = orders;
      // this.orderId = `${this.orders?.id}`;
    }
  }

  totalProducts(order: any) {
    return order.products.reduce(
      (sum: number, product: any) => sum + product.quantity,
      0,
    );
  }
}
