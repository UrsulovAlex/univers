import {
    HttpRequest,
    HttpEvent,
    HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function AuthrInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authToken = inject(AuthService).getJwtToken();

    if(authToken) {
        const modifiedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken['access_token']}`,
            },
        });
        return next(modifiedRequest);
    }
    return next(req);
}