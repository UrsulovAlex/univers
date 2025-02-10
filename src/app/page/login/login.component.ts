import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ROLE_USER_LIST } from './config';
import { RoleUser } from '../../core/interfaces/roleUsers.interfaces';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { UserRoleType } from '../../core/Types/userRole.type';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    imports: [MatCardModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
    roleUserList: RoleUser[] = ROLE_USER_LIST;
    loginForm!: FormGroup;
    formBuilder: FormBuilder = inject(FormBuilder);
    activateRote$= inject(ActivatedRoute).data;
    pageTemplate= toSignal(this.activateRote$, { initialValue: { value: '' }});
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private initDefaultRole: UserRoleType = 'USER';
    private snackBar = inject(MatSnackBar);

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.loginForm = this.formBuilder.nonNullable.group({
            email: ['', [Validators.required, Validators.email]],
            password:['', [Validators.required, Validators.minLength(6)]],
            fullName: ['', [Validators.required]],
            role: [this.initDefaultRole],
        })

        if(this.pageTemplate().value === 'login') {
            this.loginForm.removeControl('fullName');
            this.loginForm.removeControl('role');
        }
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        if(this.pageTemplate().value === 'login') {
            this.authService.logIn(this.loginForm.getRawValue()).subscribe((data) => this.snackBar.open('Login is successful', 'Close'));
        } else {
            this.userService.regisetrUser(this.loginForm.getRawValue()).subscribe(() => this.snackBar.open('Registration is successful', 'Close'));
        }
    }
}
