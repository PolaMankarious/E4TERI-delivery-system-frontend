import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user';
import { Role } from '../../models/role';

// allows the route only for the roles listed in route data
export const roleGuard: CanActivateFn = (route) => {
    const userService = inject(UserService);
    const router = inject(Router);

    const allowed = (route.data['roles'] as Role[]) ?? [];
    const role = userService.currentUser().role;

    return role && allowed.includes(role) ? true : router.createUrlTree(['/welcome']);
};