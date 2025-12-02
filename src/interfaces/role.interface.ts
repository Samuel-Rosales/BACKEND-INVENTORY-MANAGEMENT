import { PermissionInterface } from "./permission.interface";

export interface RoleInterface {
    role_id?: number;
    name: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    permissions?: PermissionInterface[];
}