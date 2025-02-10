import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { UserCredential } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, Observable, take, tap } from 'rxjs';
import { API_URL } from '../configs/main-config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = API_URL;
    private localsStorageService = inject(LocalStorageService);
    private router = inject(Router);
    private httpClient = inject(HttpClient);

    logIn(user: UserCredential ):Observable<UserCredential>{
        return this.httpClient.post<UserCredential>(`${this.apiUrl}/v1/auth/login`, user)
        .pipe(
            catchError((err) => {
                    console.error('Auth Erorr', err);
                    return EMPTY
                }
            ),
            take(1),
            tap((token) => {
                this.localsStorageService.setData('access_token', token);
                this.router.navigate(['/dashboard']);
            })
        )
    }

    logOut(): void {
        this.localsStorageService.remove('access_token');
        this.localsStorageService.remove('user');
        this.router.navigate(['/login']);
    }

    getJwtToken(): any {
        return this.localsStorageService.getData('access_token');
    }

    isAuth():boolean {
        return !!this.localsStorageService.getData('access_token');
    }
}
