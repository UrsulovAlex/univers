import { UserRoleType } from "../Types/userRole.type";

export interface User {
    id: string,
    email: string,
    fullName: string,
    role: UserRoleType,
}

export interface UserCredential {
    email: string,
    password: string,
}