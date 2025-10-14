"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("../config");
//import { ProductRoute } from "../routes/index.route"; 
class Server {
    constructor() {
        this.pre = "/api";
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        this.apiurl = process.env.API_URL || `http://localhost:${this.port}`;
        this.paths = {};
        this.swaggerSetup();
    }
    listen() {
        this.app.listen(this.port, () => {
            const URL = `${this.apiurl}/swagger/#`;
            console.log(`Server running in ${URL}`);
        });
    }
    swaggerSetup() {
        const swaggerDocs = (0, swagger_jsdoc_1.default)(config_1.swaggerOptions);
        this.app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    }
}
exports.Server = Server;
