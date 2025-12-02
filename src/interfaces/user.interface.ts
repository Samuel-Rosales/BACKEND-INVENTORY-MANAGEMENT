import { RoleInterface } from "./role.interface";

export interface UserInterface {
    user_ci: string;
    name: string;
    password: string;
    role_id: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;  

    role?: RoleInterface;
}