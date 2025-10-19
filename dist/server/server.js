"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("../config");
const index_route_1 = require("../routes/index.route");
class Server {
    constructor() {
        this.pre = "/api";
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        this.apiurl = process.env.API_URL || `http://localhost:${this.port}`;
        this.paths = {
            categories: this.pre + "/category",
            depots: this.pre + "/depot",
            movements: this.pre + "/movement",
            products: this.pre + "/product",
        };
        this.middlewares();
        this.routes();
        this.swaggerSetup();
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: "*", // o una lista segura de dominios
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static("src/public"));
        this.app.use((0, morgan_1.default)("dev"));
    }
    routes() {
        this.app.use(this.paths.categories, index_route_1.CategoryRoute);
        this.app.use(this.paths.depots, index_route_1.DepotRoute);
        this.app.use(this.paths.movements, index_route_1.MovementRoute);
        this.app.use(this.paths.products, index_route_1.ProductRoute);
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
