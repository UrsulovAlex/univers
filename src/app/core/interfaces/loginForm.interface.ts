import { FormControl } from "@angular/forms";
import { UserRoleType } from "../Types/userRole.type";

export interface LoginForm {
    password: FormControl<string | null>;
    email: FormControl<string | null>;
    fullName: FormControl<string | null>;
    role: FormControl<string | null>;
}