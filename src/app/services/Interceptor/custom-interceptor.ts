import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { API_URL } from '../../config/api.config';
import { UserService } from '../user';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const isBackendRequest =
    req.url === API_URL || req.url.startsWith(`${API_URL}/`);

  if (!isBackendRequest) {
    return next(req);
  }

  const isAuthCall = req.url.includes('/user/auth/');

  // Login and register should never receive an old authorization token.
  if (!isAuthCall) {
    const token = userService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthCall) {
        userService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    }),
  );
};