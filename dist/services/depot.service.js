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
exports.DepotServices = void 0;
const config_1 = require("../config");
class DepotService {
    async getAll() {
        try {
            const depots = await config_1.DepotDB.findAll();
            return {
                status: 200,
                message: "Depots obtained correctly",
                data: depots,
            };
        }
        catch (error) {
            console.error("Error fetching depots: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(depot_id) {
        try {
            const depot = await config_1.DepotDB.findByPk(depot_id);
            return {
                status: 200,
                message: "Depot obtained correctly",
                data: depot,
            };
        }
        catch (error) {
            console.error("Error fetching depot: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(depot) {
        try {
            const { createdAt, updatedAt, depot_id } = depot, depotData = __rest(depot, ["createdAt", "updatedAt", "depot_id"]);
            const newDepot = await config_1.DepotDB.create(depotData);
            return {
                status: 201,
                message: "Depot created correctly",
                data: newDepot,
            };
        }
        catch (error) {
            console.error("Error creating depot: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(depot_id, depot) {
        try {
            const { createdAt, updatedAt, depot_id: _ } = depot, depotData = __rest(depot, ["createdAt", "updatedAt", "depot_id"]);
            await config_1.DepotDB.update(depotData, { where: { depot_id } });
            const updatedDepot = await config_1.DepotDB.findByPk(depot_id);
            return {
                status: 200,
                message: "Depot updated correctly",
                data: updatedDepot,
            };
        }
        catch (error) {
            console.error("Error updating depot: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    //funcion mejorada para verfificar que si lo eliminó
    async delete(depot_id) {
        try {
            const deletedCount = await config_1.DepotDB.destroy({ where: { depot_id } });
            if (deletedCount === 0) {
                return {
                    status: 404,
                    message: "Depot not found",
                    data: null,
                };
            }
            return {
                status: 200,
                message: "Depot deleted successfully",
                data: null,
            };
        }
        catch (error) {
            console.error("Error deleting depot: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.DepotServices = new DepotService();
