import { RoleeDB, PermissionDB} from "../models";
import { RoleInterface } from "../interfaces/role.interface";
import { PermissionInterface } from "@/interfaces";
import { db } from "../config/sequelize.config";

class RoleService {
    async getAll() {
        try {
            const rols = await RoleeDB.findAll({
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            return {
                status: 200,
                message: "Roles obtained correctly",
                data: rols,
            }
        } catch (error) {
            console.error("Error fetching rols: ", error);

            return {
                status: 500,
                message: "Internal server error",
                date: null, 
            };
        }
    }

    async getOne(rol_id: number) {
        try {
            const role = await RoleeDB.findByPk(rol_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!role) {
                return {
                    status: 404,
                    message: "Rolee not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Rolee obtained correctly",
                data: role,
            };
        } catch (error) {
            console.error("Error fetching role: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async getPermissionsByRoleId(rol_id: number) {
        try {
            const role = await RoleeDB.findByPk(rol_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!role) {
                return {
                    status: 404,
                    message: "Rolee not found",
                    data: null,
                };
            }

            const permissions = role.permissions;

            return {
                status: 200,
                message: "Rolee obtained correctly",
                data: permissions,
            };
        } catch (error) {
            console.error("Error fetching role: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async checkPermission(roleId: number, permissionCode: string): Promise<boolean> {
        try {
            const role = await RoleeDB.findOne({
                where: { 
                    role_id: roleId 
                },
                include: [{
                    model: PermissionDB,
                    as: 'permissions',
                    where: { 
                        code: permissionCode 
                    },
                    // --- AQUÍ ESTABA EL ERROR ---
                    // Antes decía ['id'], pero tu columna se llama 'permission_id'
                    attributes: ['permission_id'] 
                }]
            });

            return !!role; 
        } catch (error) {
            console.error("Error checking permission: ", error);
            return false;
        }
    }


    async create(role: RoleInterface, permission_ids?: number[]) {
    // Iniciamos una transacción
        const t = await db.transaction(); 

        try {
            const { createdAt, updatedAt, ...rolData } = role;
            
            // 1. Crear el role DENTRO de la transacción
            const newRole = await RoleeDB.create(rolData as any, { 
                transaction: t 
            });

            // 2. Asignar permisos DENTRO de la transacción
            await newRole.setPermissions(permission_ids || [], { 
                transaction: t 
            });
            
            // 3. Si todo salió bien, confirma la transacción
            await t.commit();

            return {
                status: 201,
                message: "Rolee creado exitosamente",
                data: newRole,
            };

        } catch (error) {
            // 4. Si algo falló, revierte la transacción
            await t.rollback(); 
            console.error("Error creando role", error);
            
            return {
                status: 500,
                message: "Error interno del servidor",
                data: null,
            };
        }
    }

    async update(rol_id: number, role: Partial<RoleInterface>) {
        try {
            const { createdAt, updatedAt, role_id: _,  ...rolData } = role;

            await RoleeDB.update(rolData, { where: { role_id: rol_id } });

            const updatedRole = await RoleeDB.findByPk(rol_id);
            
            return {
                status: 200,
                message: "Rolee updated correctly",
                data: updatedRole,   
            };
        } catch (error) {
            console.error("Error updating role: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    }

    async delete(rol_id: number) {
        try {
            const deletedCount  = await RoleeDB.destroy({ where: { role_id: rol_id } });

            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Rolee not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Rolee deleted successfully",
                data: null,
            }
        } catch (error) {
            console.error("Error deleting role: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async assignPermissions(rol_id: number, permission_ids: number[]) {

        try {
            const role = await RoleeDB.findByPk(rol_id);

            if (!role) {
                return {
                    status: 404,
                    message: "Rolee not found",
                    data: null,
                };
            }

            await role.setPermissions(permission_ids);

            return {
                status: 200,
                message: "Permissions assigned successfully",
                data: null,
            };

        } catch (error) {
            console.error("Error assigning permissions to role: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };            
        }
    }

    async removePermissions(rol_id: number, permission_ids: number[]) {

        try {
            // 1. Encontrar el role
            const role = await RoleeDB.findByPk(rol_id);

            if (!role) {
                return {
                    status: 404,
                    message: "Rolee no encontrado",
                    data: null,
                };
            }

            // 2. Usar el método 'removePermissions'
            // Esto solo quita las referencias en la tabla intermedia
            await role.removePermissions(permission_ids);

            // 3. Responder con éxito
            return {
                status: 200,
                message: "Permisos eliminados exitosamente del role",
                data: null,
            };

        } catch (error) {
            console.error("Error eliminando permisos de role: ", error);
            return {
                status: 500,
                message: "Error interno del servidor al eliminar permisos",
                data: null,
            };
        }
    }
}
export const RoleServices = new RoleService();