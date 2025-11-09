export interface PermissionInterface {
    permission_id?: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}