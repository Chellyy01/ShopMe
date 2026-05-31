import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  // ngOnInit() {
  //   this.currentUser$.subscribe((user) => {
  //     return (this.user = user);
  //   });
  // }
}
