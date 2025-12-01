import { RolDB, PermissionDB} from "../models";
import { RolInterface } from "../interfaces/rol.interface";
import { PermissionInterface } from "@/interfaces";
import { db } from "../config/sequelize.config";

class RolService {
    async getAll() {
        try {
            const rols = await RolDB.findAll({
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            return {
                status: 200,
                message: "Rols obtained correctly",
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
            const rol = await RolDB.findByPk(rol_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!rol) {
                return {
                    status: 404,
                    message: "Rol not found",
                    data: null,
                };
            }

            return {
                status: 200,
                message: "Rol obtained correctly",
                data: rol,
            };
        } catch (error) {
            console.error("Error fetching rol: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async getPermissionsByRolId(rol_id: number) {
        try {
            const rol = await RolDB.findByPk(rol_id , {
                include: [{
                    model: PermissionDB,
                    as: 'permissions'
                }]
            });

            if (!rol) {
                return {
                    status: 404,
                    message: "Rol not found",
                    data: null,
                };
            }

            const permissions = rol.permissions;

            return {
                status: 200,
                message: "Rol obtained correctly",
                data: permissions,
            };
        } catch (error) {
            console.error("Error fetching rol: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }


    async create(rol: RolInterface, permission_ids?: number[]) {
    // Iniciamos una transacción
        const t = await db.transaction(); 

        try {
            const { createdAt, updatedAt, ...rolData } = rol;
            
            // 1. Crear el rol DENTRO de la transacción
            const newRol = await RolDB.create(rolData as any, { 
                transaction: t 
            });

            // 2. Asignar permisos DENTRO de la transacción
            await newRol.setPermissions(permission_ids || [], { 
                transaction: t 
            });
            
            // 3. Si todo salió bien, confirma la transacción
            await t.commit();

            return {
                status: 201,
                message: "Rol creado exitosamente",
                data: newRol,
            };

        } catch (error) {
            // 4. Si algo falló, revierte la transacción
            await t.rollback(); 
            console.error("Error creando rol", error);
            
            return {
                status: 500,
                message: "Error interno del servidor",
                data: null,
            };
        }
    }

    async update(rol_id: number, rol: Partial<RolInterface>) {
        try {
            const { createdAt, updatedAt, rol_id: _,  ...rolData } = rol;

            await RolDB.update(rolData, { where: { rol_id } });

            const updatedRol = await RolDB.findByPk(rol_id);
            
            return {
                status: 200,
                message: "Rol updated correctly",
                data: updatedRol,   
            };
        } catch (error) {
            console.error("Error updating rol: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        } 
    }

    async delete(rol_id: number) {
        try {
            const deletedCount  = await RolDB.destroy({ where: { rol_id } });

            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Rol not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Rol deleted successfully",
                data: null,
            }
        } catch (error) {
            console.error("Error deleting rol: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async assignPermissions(rol_id: number, permission_ids: number[]) {

        try {
            const rol = await RolDB.findByPk(rol_id);

            if (!rol) {
                return {
                    status: 404,
                    message: "Rol not found",
                    data: null,
                };
            }

            await rol.setPermissions(permission_ids);

            return {
                status: 200,
                message: "Permissions assigned successfully",
                data: null,
            };

        } catch (error) {
            console.error("Error assigning permissions to rol: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };            
        }
    }

    async removePermissions(rol_id: number, permission_ids: number[]) {

        try {
            // 1. Encontrar el rol
            const rol = await RolDB.findByPk(rol_id);

            if (!rol) {
                return {
                    status: 404,
                    message: "Rol no encontrado",
                    data: null,
                };
            }

            // 2. Usar el método 'removePermissions'
            // Esto solo quita las referencias en la tabla intermedia
            await rol.removePermissions(permission_ids);

            // 3. Responder con éxito
            return {
                status: 200,
                message: "Permisos eliminados exitosamente del rol",
                data: null,
            };

        } catch (error) {
            console.error("Error eliminando permisos de rol: ", error);
            return {
                status: 500,
                message: "Error interno del servidor al eliminar permisos",
                data: null,
            };
        }
    }
}
export const RolServices = new RolService();