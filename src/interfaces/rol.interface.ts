import { PermissionInterface } from "./permission.interface";

export interface RolInterface {
    rol_id?: number;
    name: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    permissions?: PermissionInterface[];
}