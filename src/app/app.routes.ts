import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthtGuard } from './core/guards/auth.guard';
import { UserService } from './core/services/user.service';
import { inject } from '@angular/core';
import { DashboardService } from './page/dashboard/services/dashboard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login', component: LoginComponent,
        data: { value : 'login'}
        
    },
    {
        path: 'register', component: LoginComponent,
        data: { value : 'register'}
    },
    {
        path: 'dashboard',
        resolve: {
            user: () => inject(UserService).initUser(),
            data: () => inject(DashboardService).initData({page:1, size: 1000})
        },
        canActivate: [AuthtGuard],
        loadComponent: () => import('./page/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full'}
];
