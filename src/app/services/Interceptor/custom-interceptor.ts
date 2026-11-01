import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../../config/api.config';
import { UserService } from '../user';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userService = inject(UserService);

  // only our own backend gets the token
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  const localToken = localStorage.getItem('token');
  if (localToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${localToken}`),
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // expired or invalid token: log out and go to login (login and register calls are excluded)
      const isAuthCall = req.url.includes('/user/auth/');
      if (err.status === 401 && !isAuthCall) {
        userService.deleteUserInfo();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};