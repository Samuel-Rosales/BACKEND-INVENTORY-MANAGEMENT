import { MovementDB, ProductDB, DepotDB, UserDB } from "../models";
import { MovementInterface, ProductInterface } from "../interfaces";
import { db } from "../config/sequelize.config";
import { inventoryService } from "./inventory.service";

class MovementService {
    
    async getAll() {
        try {
            const movements = await MovementDB.findAll({
                include: [
                    { model: ProductDB, as: "product", attributes: ['name'] },
                    { model: DepotDB, as: "depot", attributes: ['name'] },
                    { model: UserDB, as: "user", attributes: ['name'] },
                ]
            });
            
            if (movements.length === 0) {
                return {
                    status: 404,
                    message: "No movements found",
                    data: null
                };
            }

            const movementsData = movements.map(movement => {{
                const movementJson = movement.toJSON();

                return {
                    ...movementJson,
                    product: movementJson.product?.name || '',
                    depot: movementJson.depot?.name || '',
                    user: movementJson.user?.name || '',
                }
            }});

            return {
                status: 200,
                message: "Movements obtained correctly",
                data: movementsData,
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
                    { model: DepotDB, as: "depot" },
                    { model: UserDB, as: "user" }
                ]
            });

            if (!movement) {
                return {
                    status: 404,
                    message: "Movement not found",
                    data: null,
                };
            }

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

    async createAjustPositive(movement: MovementInterface, date_expiration: Date) {
        const t = await db.transaction();

        try {
            const { createdAt, updatedAt, movement_id, ... movementData } = movement;

            const user = await UserDB.findByPk(movementData.user_ci);

            if (!user) {
                return {
                    status: 400,
                    message: "User not found",
                    data: null,
                };
            }

            if (movementData.type !== 'Ajuste Positivo') {
                return {
                    status: 400,
                    message: "Invalid movement type for adjustment",
                    data: null,
                };
            }

            await inventoryService.addStockAjust(
                movementData.product_id, 
                movementData.depot_id,
                movementData.amount,
                date_expiration || new Date(),
                t
            );

            const newMovement = await MovementDB.create(movementData, { transaction: t });

            await t.commit();
            
            return {
                status: 201,
                message: "Movement created correctly",
                data: newMovement,
            };
        } catch (error) {
            await t.rollback();

            console.error("Error creating movement: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }   
    }

    async createAjustNegative(movement: MovementInterface, stock_lot_id: number) {
        const t = await db.transaction();

        try {
            const { createdAt, updatedAt, movement_id, ... movementData } = movement;

            const user = await UserDB.findByPk(movementData.user_ci);

            if (!user) {
                return {
                    status: 400,
                    message: "User not found",
                    data: null,
                };
            }

            if (movementData.type !== 'Ajuste Negativo') {
                return {
                    status: 400,
                    message: "Invalid movement type for adjustment",
                    data: null,
                };
            }

            await inventoryService.deductStockAjust(
                movementData.product_id, 
                movementData.depot_id,
                movementData.amount,
                stock_lot_id,
                t
            );

            const newMovement = await MovementDB.create(movementData, { transaction: t });

            await t.commit();

            return {
                status: 201,
                message: "Movement created correctly",
                data: newMovement,
            };
        } catch (error) {
            await t.rollback();

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