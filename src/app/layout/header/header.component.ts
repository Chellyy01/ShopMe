import { Component, inject, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../features/cart/services/cart.service';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, AsyncPipe, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public authService = inject(AuthService);
  cartService = inject(CartService);
  wishListService = inject(WishlistService);
  searchedText: string = '';
  cartCount$ = this.cartService.cartCount$;
  router = inject(Router);

  //Persistant cart on reload
  loadCartUserId: number | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) {
        this.loadCartUserId = null;
        return;
      }
      if (this.loadCartUserId === user.id) return;

      this.cartService.loadSavedCartForCurrentUser();
      this.wishListService.loadWishList();
      this.loadCartUserId = user.id;
    });
  }

  onSearchedProduct() {
    const trimmedSearchText = this.searchedText.trim();
    if (!trimmedSearchText) return;
    this.router.navigate(['/products'], {
      queryParams: { search: trimmedSearchText },
    });
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}
