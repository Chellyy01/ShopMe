import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.css',
})
export class SuccessPageComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  latestOrder: any = null;
  orderId: string = '';

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
      this.latestOrder = orders[orders.length - 1];
      this.orderId = `${this.latestOrder?.id}`;
    }
  }

  onBack() {
    console.log('back');
    this.router.navigate(['/products']);
  }

  onOrders() {
    console.log('orders');
    this.router.navigate(['/orders']);
  }
}
