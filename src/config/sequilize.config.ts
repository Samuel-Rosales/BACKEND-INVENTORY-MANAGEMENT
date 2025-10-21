import { Sequelize, type Dialect } from "sequelize";
import dotenv  from "dotenv";
dotenv.config();

import {
    CategoryModel,
    ClientModel,
    DepotModel,
    MovementModel,
    ProductModel,
    ProviderModel,
    PurchaseDetailModel,
    PurchaseModel,
    RolModel,
    SaleDetailModel,
    SaleModel,
    TypePaymentModel,
    UserModel,
} from "../models";

const dbName: string = process.env.DATABASE_NAME!;
const dbUser: string = process.env.DATABASE_USER!;
const dbPassword: string = process.env.DATABASE_PASSWORD!;
const dbDialect: Dialect = process.env.DATABASE_DIALECT as Dialect;
const dbHost: string = process.env.DATABASE_HOST!;
const dbPort: number = Number(process.env.DATABASE_PORT);

const sequelizeConfig: any = {
    dialect: dbDialect,
    host: dbHost,
    logging: false,
    dialecOpions: {
        connectYimeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquiere: 30000,
        idle: 10000,
    },
}

if (dbHost !==  "localhost" ) {
    sequelizeConfig.port =dbPort; 
}

export const db = new Sequelize(dbName, dbUser, dbPassword, sequelizeConfig); 

// Models

export const CategoryDB = db.define("categories", CategoryModel, {
    timestamps: true,
    tableName: "categories",
});

export const ClientDB = db.define("clients", ClientModel, {
    timestamps: true,
    tableName: "clients",
});

export const DepotDB = db.define("depots", DepotModel, {
    timestamps: true,
    tableName: "depots",
});

export const MovementDB = db.define("movements", MovementModel, {
    timestamps: true,
    tableName: "movements",
});

export const ProductDB = db.define("products", ProductModel, {
    timestamps: true,
    tableName: "products",
});

export const ProviderDB = db.define("providers", ProviderModel, {
    timestamps: true,
    tableName: "providers",
});

export const PurchaseDB = db.define("purchases", PurchaseModel, {
    timestamps: true,
    tableName: "purchases",
});

export const PurchaseDetailDB = db.define("purchases_details", PurchaseDetailModel, {
    timestamps: true,
    tableName: "purchases_details",
});

export const RolDB = db.define("rols", RolModel, {
    timestamps: true,
    tableName: "rols",
});

export const SaleDB = db.define("sales", SaleModel, {
    timestamps: true,
    tableName: "sales",
});

export const SaleDetailDB = db.define("sales_details", SaleDetailModel, {
    timestamps: true,
    tableName: "sales_details",
}); 

export const TypePaymentDB = db.define("types_payments", TypePaymentModel, {
    timestamps: true,
    tableName: "types_payments",
});

export const UserDB = db.define("users", UserModel, {
    timestamps: true,
    tableName: "users",
}); 

// Relacionships

ProductDB.belongsTo(CategoryDB, { foreignKey: "category_id", as: "category" });
CategoryDB.hasMany(ProductDB, { foreignKey: "category_id", as: "products" });

MovementDB.belongsTo(DepotDB, { foreignKey: "depot_id", as: "depot" });
DepotDB.hasMany(MovementDB, { foreignKey: "depot_id", as: "movements", onDelete: "CASCADE", hooks: true});

MovementDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
ProductDB.hasMany(MovementDB, { foreignKey: "product_id", as: "movements", onDelete: "CASCADE", hooks: true });

UserDB.belongsTo(RolDB, { foreignKey: "rol_id", as: "rol" });
RolDB.hasMany(UserDB, { foreignKey: "rol_id", as: "users" });

PurchaseDB.belongsTo(TypePaymentDB, { foreignKey: "type_payment_id", as: "type_payment" });
TypePaymentDB.hasMany(PurchaseDB, { foreignKey: "type_payment_id", as: "purchases" });

PurchaseDB.belongsTo(ProviderDB, { foreignKey: "provider_id", as: "provider" });
ProviderDB.hasMany(PurchaseDB, { foreignKey: "provider_id", as: "purchases" });

PurchaseDB.belongsTo(UserDB, { foreignKey: "user_ci", as: "user" });
UserDB.hasMany(PurchaseDB, { foreignKey: "user_ci", as: "purchases" });

SaleDB.belongsTo(TypePaymentDB, { foreignKey: "type_payment_id", as: "type_payment" });
TypePaymentDB.hasMany(SaleDB, { foreignKey: "type_payment_id", as: "sales" });

SaleDB.belongsTo(ClientDB, { foreignKey: "client_ci", as: "client" });
ClientDB.hasMany(SaleDB, { foreignKey: "client_ci", as: "sales" });

SaleDB.belongsTo(UserDB, { foreignKey: "user_ci", as: "user" });
UserDB.hasMany(SaleDB, { foreignKey: "user_ci", as: "sales" });

PurchaseDetailDB.belongsTo(PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
PurchaseDB.hasMany(PurchaseDetailDB, { foreignKey: "purchase_id", as: "purchase_details" });

PurchaseDetailDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
ProductDB.hasMany(PurchaseDetailDB, { foreignKey: "product_id", as: "purchase_details" });

SaleDetailDB.belongsTo(SaleDB, { foreignKey: "sale_id", as: "sale" });
SaleDB.hasMany(SaleDetailDB, { foreignKey: "sale_id", as: "sale_details" });

SaleDetailDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
ProductDB.hasMany(SaleDetailDB, { foreignKey: "product_id", as: "sale_details" });

// Sync

export const syncModels = async() => {
    try {
        console.log('DB env', {
            DATABASE_DIALECT: process.env.DATABASE_DIALECT,
            DATABASE_HOST: process.env.DATABASE_HOST,
            DATABASE_USER: process.env.DATABASE_USER,
            DATABASE_PASSWORD_exists: !!process.env.DATABASE_PASSWORD,
            DATABASE_PORT: process.env.DATABASE_PORT
            });

        await db.authenticate();
        console.log("Connecting to database...");

        await db.sync({ alter: true});
        console.log("Database Synced");
    } catch (error) {
        console.error("Error to connect to database: ", error);
        throw error;    
    }
}

syncModels();

export default db