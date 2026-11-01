import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user';

// blocks pages that need a logged in user
export const authGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};