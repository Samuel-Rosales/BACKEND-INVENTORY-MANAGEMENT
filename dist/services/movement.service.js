"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementServices = void 0;
const config_1 = require("../config");
class MovementService {
    async getAll() {
        try {
            const movements = await config_1.MovementDB.findAll({
                include: [
                    { model: config_1.ProductDB, as: "product" },
                    { model: config_1.DepotDB, as: "depot" }
                ]
            });
            return {
                status: 200,
                message: "Movements obtained correctly",
                data: movements,
            };
        }
        catch (error) {
            console.error("Error fetchig movements: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(movement_id) {
        try {
            const movement = await config_1.MovementDB.findByPk(movement_id, {
                include: [
                    { model: config_1.ProductDB, as: "product" },
                    { model: config_1.DepotDB, as: "depot" }
                ]
            });
            return {
                status: 200,
                message: "Movement obtained correctly",
                data: movement,
            };
        }
        catch (error) {
            console.error("Error fetching movement: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null
            };
        }
    }
    async create(movement) {
        try {
            const { createdAt, updatedAt, movement_id } = movement, movementData = __rest(movement, ["createdAt", "updatedAt", "movement_id"]);
            const newMovement = await config_1.MovementDB.create(movementData);
            return {
                status: 201,
                message: "Movement created correctly",
                data: newMovement,
            };
        }
        catch (error) {
            console.error("Error creating movement: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(movement_id, movement) {
        try {
            const { createdAt, updatedAt } = movement, movementData = __rest(movement, ["createdAt", "updatedAt"]);
            await config_1.MovementDB.update(movementData, { where: { movement_id } });
            const updatedMovement = await config_1.MovementDB.findByPk(movement_id);
            return {
                status: 200,
                message: "Movement update correctly",
                data: updatedMovement,
            };
        }
        catch (error) {
            console.error("Error updating movement: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(movement_id) {
        try {
            const deletedCount = await config_1.MovementDB.destroy({ where: { movement_id } });
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
        }
        catch (error) {
            console.error("Error deleting Movement: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.MovementServices = new MovementService();
