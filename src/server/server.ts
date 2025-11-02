import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../config";

// --- CAMBIO CLAVE 1: Importar desde el nuevo índice de modelos ---
import { syncDatabase } from "../models";

import {
    CategoryRoute,
    ClientRoute,
    DepotRoute,
    MovementRoute,
    ProductRoute,
    ProviderRoute,
    PurchaseGeneralItemRoute,
    PurchaseLotItemRoute,
    PurchaseRoute,
    RolRoute,
    SaleDetailRoute,
    SaleRoute,
    StockGeneralRoute,
    StockLotRoute,
    TypePaymentRoute,
    UserRoute,
} from "../routes/index.route";

export class Server {
    private app: Application
    private port: string
    private apiurl: string
    private pre = "/api"
    private paths: any

    constructor() {
        this.app = express()
        this.port = process.env.PORT || "3000"
        this.apiurl = process.env.API_URL || `http://localhost:${this.port}`
        this.paths = {
            categories: this.pre + "/category",
            clients: this.pre + "/client",
            depots: this.pre + "/depot",
            movements: this.pre + "/movement",
            products: this.pre + "/product",
            providers: this.pre + "/provider",
            purchases: this.pre + "/purchase",
            purchase_general_items: this.pre + "/purchase_general_item",
            purchase_lot_items: this.pre + "/purchase_lot_item",
            rols: this.pre + "/rol",
            sales: this.pre + "/sale",
            sales_details: this.pre + "/sale_detail",
            stock_generals: this.pre + "/stock_general",
            stock_lots: this.pre + "/stock_lot",
            types_payments: this.pre + "/type_payment",
            users: this.pre + "/user",
        }

        this.middlewares()
        this.routes()
        this.swaggerSetup()
    }

    // --- CAMBIO CLAVE 2: Nuevo método para conectar y sincronizar la DB ---
    async dbConnect() {
        try {
            // La opción 'alter: true' es ideal para desarrollo
            await syncDatabase({ alter: true });
            console.log("Database successfully synchronized");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw new Error("Unable to connect to the database");
        }
    }

    middlewares() {
        this.app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        }))

        this.app.use(express.json())
        this.app.use(express.static("src/public"))
        this.app.use(morgan("dev"))
    }

    routes() {
        // ...tus rutas se quedan igual
        this.app.use(this.paths.categories, CategoryRoute);
        this.app.use(this.paths.clients, ClientRoute);
        this.app.use(this.paths.depots, DepotRoute);
        this.app.use(this.paths.movements, MovementRoute);
        this.app.use(this.paths.products, ProductRoute);
        this.app.use(this.paths.providers, ProviderRoute);
        this.app.use(this.paths.purchases, PurchaseRoute);
        this.app.use(this.paths.purchase_general_items, PurchaseGeneralItemRoute);
        this.app.use(this.paths.purchase_lot_items , PurchaseLotItemRoute);
        this.app.use(this.paths.rols, RolRoute);
        this.app.use(this.paths.sales, SaleRoute);
        this.app.use(this.paths.sales_details, SaleDetailRoute);
        this.app.use(this.paths.stock_generals , StockGeneralRoute);
        this.app.use(this.paths.stock_lots , StockLotRoute);
        this.app.use(this.paths.types_payments, TypePaymentRoute);
        this.app.use(this.paths.users, UserRoute);
    }

    // --- CAMBIO CLAVE 3: El método listen ahora es asíncrono ---
    async listen() {
        // Primero, espera a que la base de datos esté lista
        await this.dbConnect();

        // Luego, inicia el servidor
        this.app.listen(this.port, () => {
            const URL = `${this.apiurl}/swagger/#`
            console.log(`🚀 Server running in ${URL}`)
        })
    }

    swaggerSetup() {
        const swaggerDocs = swaggerJSDoc(swaggerOptions)
        this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    }
}