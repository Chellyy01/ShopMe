import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'success') {
    const toast: Toast = {
      id: Date.now(),
      message,
      type,
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => {
      this.dismiss(toast.id);
    }, 3000);
  }

  dismiss(id: number) {
    this.toastsSubject.next(
      this.toastsSubject.value.filter((toast) => toast.id !== id),
    );
  }
}
