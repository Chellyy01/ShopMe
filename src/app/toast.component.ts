import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
