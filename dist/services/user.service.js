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
exports.UserServices = void 0;
const config_1 = require("../config");
class UserService {
    async getAll() {
        try {
            const users = await config_1.UserDB.findAll({
                include: [{
                        model: config_1.RolDB, as: "rol"
                    }]
            });
            return {
                status: 200,
                message: "Users obtained correctly",
                data: users,
            };
        }
        catch (error) {
            console.error("Error fetching users", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(user_ci) {
        try {
            const user = await config_1.UserDB.findByPk(user_ci, {
                include: [{
                        model: config_1.RolDB, as: "rol"
                    }]
            });
            return {
                status: 200,
                message: "User obtained correctly",
                data: user,
            };
        }
        catch (error) {
            console.error("Error fetching user: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(user) {
        try {
            const { createdAt, updatedAt } = user, userData = __rest(user, ["createdAt", "updatedAt"]);
            const newUser = await config_1.UserDB.create(userData);
            return {
                status: 201,
                message: "User created successfully",
                data: newUser,
            };
        }
        catch (error) {
            console.error("Error creating user: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(ci, user) {
        try {
            const { createdAt, updatedAt, ci: _ } = user, userData = __rest(user, ["createdAt", "updatedAt", "ci"]);
            await config_1.UserDB.update(userData, { where: { ci } });
            const updatedUser = await config_1.UserDB.findByPk(ci);
            return {
                status: 200,
                message: "User update correctly",
                data: updatedUser,
            };
        }
        catch (error) {
            console.error("Error updating user: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(user_ci) {
        try {
            await config_1.UserDB.destroy({ where: { user_ci } });
            return {
                status: 200,
                message: "User deleting successfully",
            };
        }
        catch (error) {
            console.error("Error deleting user", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.UserServices = new UserService();
