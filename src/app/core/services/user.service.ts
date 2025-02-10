import { inject, Injectable } from '@angular/core';
import { API_URL } from '../configs/main-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, Observable, switchMap, take, tap } from 'rxjs';
import { LocalStorageService } from './localStorage.service';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = API_URL;
    private httpClient = inject(HttpClient);
    private localStorageService = inject(LocalStorageService);
    private router = inject(Router);
    private authService = inject(AuthService);

    initUser(): Observable<User> {
        return this.httpClient.get<User>(`${this.apiUrl}/v1/user`)        
        .pipe(
            catchError((err) => {
                    console.error('User Erorr', err);
                    return EMPTY
                }
            ),
            take(1),
            tap((user) => {
                this.localStorageService.setData('user', user);
            })
        )
    }

    regisetrUser(user: any): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/v1/user/register`, user )
        .pipe(
            catchError((err) => {
                    console.error('User Erorr', err);
                    return EMPTY
                }
            ),
            switchMap(() => {
                const payload = {
                    email: user?.email, 
                    password: user?.password 
                }
                return this.authService.logIn(payload);
            })
        )
    }

    getUser(): User {
        return this.localStorageService.getData('user');
    }
}
