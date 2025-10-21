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
// --- CAMBIO CLAVE 1: Importar desde el nuevo índice de modelos ---
const models_1 = require("../models");
const index_route_1 = require("../routes/index.route");
class Server {
    constructor() {
        this.pre = "/api";
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        this.apiurl = process.env.API_URL || `http://localhost:${this.port}`;
        this.paths = {
            // ...tus paths se quedan igual
            categories: this.pre + "/category",
            clients: this.pre + "/client",
            depots: this.pre + "/depot",
            movements: this.pre + "/movement",
            products: this.pre + "/product",
            providers: this.pre + "/provider",
            purchases: this.pre + "/purchase",
            purchases_details: this.pre + "/purchase_detail",
            rols: this.pre + "/rol",
            types_payments: this.pre + "/type_payment",
            sales: this.pre + "/sale",
            sales_details: this.pre + "/sale_detail",
            users: this.pre + "/user",
        };
        this.middlewares();
        this.routes();
        this.swaggerSetup();
    }
    // --- CAMBIO CLAVE 2: Nuevo método para conectar y sincronizar la DB ---
    async dbConnect() {
        try {
            // La opción 'alter: true' es ideal para desarrollo
            await (0, models_1.syncDatabase)({ alter: true });
            console.log("Database successfully synchronized");
        }
        catch (error) {
            console.error("Unable to connect to the database:", error);
            throw new Error("Unable to connect to the database");
        }
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static("src/public"));
        this.app.use((0, morgan_1.default)("dev"));
    }
    routes() {
        // ...tus rutas se quedan igual
        this.app.use(this.paths.categories, index_route_1.CategoryRoute);
        this.app.use(this.paths.clients, index_route_1.ClientRoute);
        this.app.use(this.paths.depots, index_route_1.DepotRoute);
        this.app.use(this.paths.movements, index_route_1.MovementRoute);
        this.app.use(this.paths.products, index_route_1.ProductRoute);
        this.app.use(this.paths.providers, index_route_1.ProviderRoute);
        this.app.use(this.paths.purchases, index_route_1.PurchaseRoute);
        this.app.use(this.paths.purchases_details, index_route_1.PurchaseDetailRoute);
        this.app.use(this.paths.rols, index_route_1.RolRoute);
        this.app.use(this.paths.types_payments, index_route_1.TypePaymentRoute);
        this.app.use(this.paths.sales, index_route_1.SaleRoute);
        this.app.use(this.paths.sales_details, index_route_1.SaleDetailRoute);
        this.app.use(this.paths.users, index_route_1.UserRoute);
    }
    // --- CAMBIO CLAVE 3: El método listen ahora es asíncrono ---
    async listen() {
        // Primero, espera a que la base de datos esté lista
        await this.dbConnect();
        // Luego, inicia el servidor
        this.app.listen(this.port, () => {
            const URL = `${this.apiurl}/swagger/#`;
            console.log(`🚀 Server running in ${URL}`);
        });
    }
    swaggerSetup() {
        const swaggerDocs = (0, swagger_jsdoc_1.default)(config_1.swaggerOptions);
        this.app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    }
}
exports.Server = Server;
