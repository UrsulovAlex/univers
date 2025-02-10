import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthtGuard: CanActivateFn =  (route, state) => {
    const router = inject(Router);

    if (inject(AuthService).isAuth()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};