import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient)

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          return http.post<any>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
            switchMap((response) => {
              localStorage.setItem('token', response.accessToken);

              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed', refreshError);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              return throwError(() => refreshError);
            })
          );
        }
    
      } 
      
      return throwError(() => error);
    })
  )
  
};
