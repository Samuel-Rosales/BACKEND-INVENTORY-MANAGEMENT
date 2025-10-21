import { run } from "node:test";
import { RolDB } from "../config";
import { RolInterface } from "../interfaces/rol.interface";

class RolService {
    async getAll() {
        try {
            const rols = await RolDB.findAll();

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
            const rol = await RolDB.findByPk(rol_id);

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

    async create(rol: RolInterface) {
        try {
            const { createdAt, updatedAt, ...rolData  } = rol;
            
            const newRol = await RolDB.create(rolData as any);

            return {
                status: 201,
                message: "Rol created successfully",
                data: newRol,
            };
        } catch (error) {
            console.error("Error creating rol", error);

            return {
                status: 500,
                message: "Internal server error",
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
}

export const RolServices = new RolService();