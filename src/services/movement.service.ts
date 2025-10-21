import { MovementDB, ProductDB, DepotDB } from "../models";
import { MovementInterface } from "../interfaces";

class MovementService {
    async getAll() {
        try {
            const movements = await MovementDB.findAll({
                include: [
                    { model: ProductDB, as: "product" },
                    { model: DepotDB, as: "depot" }
                ]
            });

            return {
                status: 200,
                message: "Movements obtained correctly",
                data: movements,
            };
        } catch (error) {
            console.error("Error fetchig movements: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(movement_id: number) {
        try {
            const movement = await MovementDB.findByPk(movement_id, {
                include: [
                    { model: ProductDB, as: "product" },
                    { model: DepotDB, as: "depot" }
                ]
            });

            return {
                status: 200,
                message: "Movement obtained correctly",
                data: movement,
            };
        } catch (error) {
            console.error("Error fetching movement: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null
            };
        }
    }

    async create(movement: MovementInterface) {
        try {
            const { createdAt, updatedAt, movement_id, ... movementData } = movement;

            const newMovement = await MovementDB.create(movementData);

            return {
                status: 201,
                message: "Movement created correctly",
                data: newMovement,
            };
        } catch (error) {
            console.error("Error creating movement: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }   
    }

    async update(movement_id: number, movement: Partial<MovementInterface>) {
        try {
            const { createdAt, updatedAt, movement_id: _, ... movementData} = movement;

            await MovementDB.update(movementData, { where: { movement_id } });

            const updatedMovement = await MovementDB.findByPk(movement_id);

            return {
                status: 200,
                message: "Movement update correctly",
                data: updatedMovement,
            };
        } catch (error) {
            console.error("Error updating movement: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete(movement_id: number) {
        try {
            const deletedCount = await MovementDB.destroy({ where: { movement_id } });

            if (deletedCount === 0) {
            return {
                status: 404,
                message: "Movement not found",
                data: null,
            };
            }

            return {
                status: 200,
                message: "Movement deleted successfully",
                data: null,
            };
        } catch (error) {
            console.error("Error deleting Movement: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const MovementServices = new MovementService();