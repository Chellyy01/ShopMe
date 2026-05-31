import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    this.loadCurrentUserFromStorage();
  }
  http = inject(HttpClient);
  baseUrl: string = environment.apiUrl;

  currentUserBehaviorSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserBehaviorSubject.asObservable();

  login(username: string, password: string) {
    return this.http
      .post<User>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        tap((user) => {
          this.currentUserBehaviorSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('refreshToken', user.refreshToken);
        }),
      );
  }

  logout() {
    this.currentUserBehaviorSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  loadCurrentUserFromStorage() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('currentUser');
    if (token && userJson) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserBehaviorSubject.next(user);
        },
        error: (err) => {
          console.error('Failed to load current user from storage', err);
          this.logout();
        },
      });
    } else {
      this.logout();
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`).pipe(
      tap((user) => {
        this.currentUserBehaviorSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.accessToken) {
          localStorage.setItem('token', user.accessToken);
        }
        if (user.refreshToken) {
          localStorage.setItem('refreshToken', user.refreshToken);
        }
      }),
    );
  }

  registerUser(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) {
    return this.http.post(`${this.baseUrl}/users/add`, {
      firstName,
      lastName,
      username,
      email,
      password,
    });
  }

  getAuthUser() {
    return this.http.get<User>(`${this.baseUrl}/user/me`);
  }
}
