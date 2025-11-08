export interface UserInterface {
    user_ci: string;
    name: string;
    password: string;
    rol_id: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;  
}