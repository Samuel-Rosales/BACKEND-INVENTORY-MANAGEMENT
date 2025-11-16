import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../config";

import cron from 'node-cron'; // --- NUEVO ---
import axios from 'axios';     // --- NUEVO ---

import { ExchangeRateDB } from "../models"; 

// --- CAMBIO CLAVE 1: Importar desde el nuevo índice de modelos ---
import { syncDatabase } from "../models";

import {
    AuthRoute,
    CategoryRoute,
    ClientRoute,
    DepotRoute,
    ExchangeRateRoute,
    MovementRoute,
    PermissionRoute,
    ProductRoute,
    ProviderRoute,
    PurchaseGeneralItemRoute,
    PurchaseLotItemRoute,
    PurchaseRoute,
    RolRoute,
    SaleItemRoute,
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
        this.app.use(express.json({ limit: "50mb" })); // Middleware para parsear bodies JSON
        this.app.use(express.urlencoded({ limit: "50mb", extended: true })); // Middleware para parsear bodies URL-encoded
        this.port = process.env.PORT || "3000"
        this.apiurl = process.env.API_URL || `http://localhost:${this.port}`
        this.paths = {
            auths: this.pre + "/auth",
            categories: this.pre + "/category",
            clients: this.pre + "/client",
            depots: this.pre + "/depot",
            exchange_rates: this.pre + "/exchange_rate",
            movements: this.pre + "/movement",
            permissions: this.pre + "/permission",
            products: this.pre + "/product",
            providers: this.pre + "/provider",
            purchases: this.pre + "/purchase",
            purchase_general_items: this.pre + "/purchase_general_item",
            purchase_lot_items: this.pre + "/purchase_lot_item",
            rols: this.pre + "/rol",
            sales: this.pre + "/sale",
            sale_items: this.pre + "/sale_item",
            stock_generals: this.pre + "/stock_general",
            stock_lots: this.pre + "/stock_lot",
            type_payments: this.pre + "/type_payment",
            users: this.pre + "/user",
        }

        this.middlewares()
        this.routes()
        this.swaggerSetup()

        this.setupCronJobs();
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
        this.app.use(this.paths.auths, AuthRoute);
        this.app.use(this.paths.categories, CategoryRoute);
        this.app.use(this.paths.clients, ClientRoute);
        this.app.use(this.paths.depots, DepotRoute);
        this.app.use(this.paths.exchange_rates, ExchangeRateRoute);
        this.app.use(this.paths.movements, MovementRoute);
        this.app.use(this.paths.permissions, PermissionRoute);
        this.app.use(this.paths.products, ProductRoute);
        this.app.use(this.paths.providers, ProviderRoute);
        this.app.use(this.paths.purchases, PurchaseRoute);
        this.app.use(this.paths.purchase_general_items, PurchaseGeneralItemRoute);
        this.app.use(this.paths.purchase_lot_items , PurchaseLotItemRoute);
        this.app.use(this.paths.rols, RolRoute);
        this.app.use(this.paths.sales, SaleRoute);
        this.app.use(this.paths.sale_items, SaleItemRoute);
        this.app.use(this.paths.stock_generals , StockGeneralRoute);
        this.app.use(this.paths.stock_lots , StockLotRoute);
        this.app.use(this.paths.type_payments, TypePaymentRoute);
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

    private async updateRateDaily(): Promise<void> {
        try {
            const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            
            // Usamos el modelo TasaDeCambio importado
            const rateExist = await ExchangeRateDB.findOne({ where: { date: today } });
            
            if (rateExist) {
                console.log(`[Cron Job] La tasa para ${today} ya está registrada.`);
                return;
            }

            // ¡¡CAMBIA ESTA URL por la de tu proveedor!!
            const response = await axios.get<any>('https://api-bcv-pi.vercel.app/api/tasa');
            
            // Asumo que la respuesta es { "tasa": 36.50 } o similar
            const rateDate = response.data.tasas.USD.valor_num;

            if (!rateDate || isNaN(rateDate)) {
                throw new Error('Respuesta de API de tasa inválida');
            }

            await ExchangeRateDB.create({
                rate: rateDate,
                date: today
            });

            console.log(`[Cron Job] Tasa de cambio actualizada para ${today}: ${rateDate}`);

        } catch (error) {
            const message = (error instanceof Error) ? error.message : 'Error desconocido';
            // Es normal que esto falle al primer inicio si la DB se está creando con 'alter: true'
            console.error('[Cron Job] Error al actualizar la tasa:', message);
        }
    }

    // --- NUEVO: Método para configurar todos los cron jobs ---
    private setupCronJobs(): void {
        // Ejecutar todos los días a las 8:00 AM, zona horaria de Venezuela
        cron.schedule('22 12 * * *', () => {
            console.log('[Cron Job] Ejecutando tarea programada de las 8:00 AM...');
            this.updateRateDaily();
        }, {
            timezone: "America/Caracas" // ¡Importante!
        });
    }
}