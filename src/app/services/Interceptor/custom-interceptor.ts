import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const localToken = localStorage.getItem('token');
  if (localToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${localToken}`),
    });
  }

  return next(req);
};
