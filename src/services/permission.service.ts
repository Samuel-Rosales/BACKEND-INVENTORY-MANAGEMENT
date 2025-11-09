import { PermissionDB } from "../models";
import { PermissionInterface } from "../interfaces/permission.interface";

class PermissionService {
    async getAll() {
        try {
            const permissions = await PermissionDB.findAll();

            return {
                status: 200,
                message: "Permissions obtained correctly",
                data: permissions,
            }
        } catch (error) {
            console.error("Error fetching permissions: ", error);

            return {
                status: 500,
                message: "Internal server error",
                date: null, 
            };
        }
    }

    async getOne(permission_id: number) {
        try {
            const permission = await PermissionDB.findByPk(permission_id);

            if (!permission) {
                return {
                    status: 404,
                    message: "Permission not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Permission obtained correctly",
                data: permission,
            };
        } catch (error) {
            console.error("Error fetching permission: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(permission: PermissionInterface) {
        try {
            const { createdAt, updatedAt, ...permissionData  } = permission;
            
            const newPermission = await PermissionDB.create(permissionData as any);

            return {
                status: 201,
                message: "Permission created successfully",
                data: newPermission,
            };
        } catch (error) {
            console.error("Error creating permission", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(permission_id: number, permission: Partial<PermissionInterface>) {
        try {
            const { createdAt, updatedAt, permission_id: _,  ...permissionData } = permission;

            await PermissionDB.update(permissionData, { where: { permission_id } });

            const updatedPermission = await PermissionDB.findByPk(permission_id);
            
            return {
                status: 200,
                message: "Permission updated correctly",
                data: updatedPermission,   
            };
        } catch (error) {
            console.error("Error updating permission: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    }

    async delete(permission_id: number) {
        try {
            const deletedCount  = await PermissionDB.destroy({ where: { permission_id } });

            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Permission not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Permission deleted successfully",
                data: null,
            }
        } catch (error) {
            console.error("Error deleting permission: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const PermisionServices = new PermissionService();