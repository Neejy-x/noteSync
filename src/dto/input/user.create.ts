
export interface UserCreateDTO {
    email: string;
    password: string;
    username: string;
    role?: UserRole;
}

export enum UserRole{
    ADMIN = 'admin',
    USER = 'user' 
}