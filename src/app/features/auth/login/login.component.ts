import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { WishlistService } from '../../wishlist/services/wishlist.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authservice = inject(AuthService);
  cartService = inject(CartService);
  wishListService = inject(WishlistService);
  toastService = inject(ToastService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  isLoading: boolean = false;
  errorMessage: string = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields with valid data.';
      this.toastService.show(this.errorMessage, 'info');
      return;
    }
    this.isLoading = true;

    const { username, password } = this.loginForm.value;

    this.authservice.login(username!, password!).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.cartService.loadSavedCartForCurrentUser();
        this.wishListService.loadWishList();
        const returnUrl =
          this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message ||
          'That username or password does not look right. Please try again.';
        this.toastService.show(this.errorMessage, 'error');
      },
    });
  }
}
