import { RoleDB, PermissionDB} from "../models";
import { RoleInterface } from "../interfaces/role.interface";
import { PermissionInterface } from "@/interfaces";
import { db } from "../config/sequelize.config";

class RoleService {
    async getAll() {
        try {
            const rols = await RoleDB.findAll({
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

    async getOne(role_id: number) {
        try {
            const role = await RoleDB.findByPk(role_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!role) {
                return {
                    status: 404,
                    message: "Role not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Role obtained correctly",
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

    async getPermissionsByRoleId(role_id: number) {
        try {
            const role = await RoleDB.findByPk(role_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!role) {
                return {
                    status: 404,
                    message: "Role not found",
                    data: null,
                };
            }

            const permissions = role.permissions;

            return {
                status: 200,
                message: "Role obtained correctly",
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
            const role = await RoleDB.findOne({
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
            const newRole = await RoleDB.create(rolData as any, { 
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
                message: "Role creado exitosamente",
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

    async update(role_id: number, role: Partial<RoleInterface>) {
        try {
            const { createdAt, updatedAt, role_id: _,  ...rolData } = role;

            await RoleDB.update(rolData, { where: { role_id: role_id } });

            const updatedRole = await RoleDB.findByPk(role_id);
            
            return {
                status: 200,
                message: "Role updated correctly",
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

    async delete(role_id: number) {
        try {
            const deletedCount  = await RoleDB.destroy({ where: { role_id: role_id } });

            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Role not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Role deleted successfully",
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

    async assignPermissions(role_id: number, permission_ids: number[]) {

        try {
            const role = await RoleDB.findByPk(role_id);

            if (!role) {
                return {
                    status: 404,
                    message: "Role not found",
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

    async removePermissions(role_id: number, permission_ids: number[]) {

        try {
            // 1. Encontrar el role
            const role = await RoleDB.findByPk(role_id);

            if (!role) {
                return {
                    status: 404,
                    message: "Role no encontrado",
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