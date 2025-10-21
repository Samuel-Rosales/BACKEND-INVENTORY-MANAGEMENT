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
exports.RolServices = void 0;
const models_1 = require("../models");
class RolService {
    async getAll() {
        try {
            const rols = await models_1.RolDB.findAll();
            return {
                status: 200,
                message: "Rols obtained correctly",
                data: rols,
            };
        }
        catch (error) {
            console.error("Error fetching rols: ", error);
            return {
                status: 500,
                message: "Internal server error",
                date: null,
            };
        }
    }
    async getOne(rol_id) {
        try {
            const rol = await models_1.RolDB.findByPk(rol_id);
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
        }
        catch (error) {
            console.error("Error fetching rol: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(rol) {
        try {
            const { createdAt, updatedAt } = rol, rolData = __rest(rol, ["createdAt", "updatedAt"]);
            const newRol = await models_1.RolDB.create(rolData);
            return {
                status: 201,
                message: "Rol created successfully",
                data: newRol,
            };
        }
        catch (error) {
            console.error("Error creating rol", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(rol_id, rol) {
        try {
            const { createdAt, updatedAt, rol_id: _ } = rol, rolData = __rest(rol, ["createdAt", "updatedAt", "rol_id"]);
            await models_1.RolDB.update(rolData, { where: { rol_id } });
            const updatedRol = await models_1.RolDB.findByPk(rol_id);
            return {
                status: 200,
                message: "Rol updated correctly",
                data: updatedRol,
            };
        }
        catch (error) {
            console.error("Error updating rol: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(rol_id) {
        try {
            const deletedCount = await models_1.RolDB.destroy({ where: { rol_id } });
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
            };
        }
        catch (error) {
            console.error("Error deleting rol: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.RolServices = new RolService();
