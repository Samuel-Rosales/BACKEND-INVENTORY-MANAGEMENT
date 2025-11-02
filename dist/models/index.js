"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.SaleDetailDB = exports.PurchaseLotItemDB = exports.PurchaseGeneralItemDB = exports.StockLotDB = exports.StockGeneralDB = exports.SaleDB = exports.MovementDB = exports.PurchaseDB = exports.UserDB = exports.ProductDB = exports.TypePaymentDB = exports.RolDB = exports.ProviderDB = exports.DepotDB = exports.ClientDB = exports.CategoryDB = void 0;
const sequelize_config_1 = require("../config/sequelize.config");
// --- 1. IMPORTA TODAS LAS "FACTORIES" DE TUS MODELOS ---
const category_model_1 = require("./category.model");
const client_model_1 = require("./client.model");
const depot_model_1 = require("./depot.model");
const movement_model_1 = require("./movement.model");
const product_model_1 = require("./product.model");
const provider_model_1 = require("./provider.model");
const purchase_model_1 = require("./purchase.model");
const purchase_general_item_model_1 = require("./purchase-general-item.model");
const purchase_lot_item_model_1 = require("./purchase-lot-item.model");
const rol_model_1 = require("./rol.model");
const sale_model_1 = require("./sale.model");
const sale_item_model_1 = require("./sale-item.model");
const stock_general_model_1 = require("./stock-general.model");
const stock_lot_model_1 = require("./stock-lot.model");
const type_payment_model_1 = require("./type-payment.model");
const user_model_1 = require("./user.model");
// --- 2. INICIALIZA LOS MODELOS EN ORDEN DE DEPENDENCIA ---
// Nivel 1: Modelos que no dependen de otros
exports.CategoryDB = (0, category_model_1.CategoryFactory)(sequelize_config_1.db);
exports.ClientDB = (0, client_model_1.ClientFactory)(sequelize_config_1.db);
exports.DepotDB = (0, depot_model_1.DepotFactory)(sequelize_config_1.db);
exports.ProviderDB = (0, provider_model_1.ProviderFactory)(sequelize_config_1.db);
exports.RolDB = (0, rol_model_1.RolFactory)(sequelize_config_1.db);
exports.TypePaymentDB = (0, type_payment_model_1.TypePaymentFactory)(sequelize_config_1.db);
// Nivel 2: Modelos que dependen del Nivel 1
exports.ProductDB = (0, product_model_1.ProductFactory)(sequelize_config_1.db); // Depende de Category
exports.UserDB = (0, user_model_1.UserFactory)(sequelize_config_1.db); // Depende de Rol
// Nivel 3: Modelos de Transacciones que dependen de Nivel 1 y 2
exports.PurchaseDB = (0, purchase_model_1.PurchaseFactory)(sequelize_config_1.db); // Depende de Provider, User, TypePayment
exports.MovementDB = (0, movement_model_1.MovementFactory)(sequelize_config_1.db); // Depende de Depot, Product
exports.SaleDB = (0, sale_model_1.SaleFactory)(sequelize_config_1.db); // Depende de Client, User, TypePayment
exports.StockGeneralDB = (0, stock_general_model_1.StockGeneralFactory)(sequelize_config_1.db); // Depende de Product, Depot
exports.StockLotDB = (0, stock_lot_model_1.StockLotFactory)(sequelize_config_1.db); // Depende de Product, Depot
// Nivel 4: Modelos de Detalle que dependen de Nivel 3
exports.PurchaseGeneralItemDB = (0, purchase_general_item_model_1.PurchaseGeneralItemFactory)(sequelize_config_1.db); // Depende de Purchase, Product
exports.PurchaseLotItemDB = (0, purchase_lot_item_model_1.PurchaseLotItemFactory)(sequelize_config_1.db); // Depende de Purchase, Product
exports.SaleDetailDB = (0, sale_item_model_1.SaleDetailFactory)(sequelize_config_1.db); // Depende de Sale, Product
// --- 3. DEFINE TODAS LAS RELACIONES ---
console.log("Defining model relationships...");
exports.ProductDB.belongsTo(exports.CategoryDB, { foreignKey: "category_id", as: "category" });
exports.CategoryDB.hasMany(exports.ProductDB, { foreignKey: "category_id", as: "products" });
exports.MovementDB.belongsTo(exports.DepotDB, { foreignKey: "depot_id", as: "depot" });
exports.DepotDB.hasMany(exports.MovementDB, { foreignKey: "depot_id", as: "movements" });
exports.MovementDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
exports.ProductDB.hasMany(exports.MovementDB, { foreignKey: "product_id", as: "movements" });
exports.UserDB.belongsTo(exports.RolDB, { foreignKey: "rol_id", as: "rol" });
exports.RolDB.hasMany(exports.UserDB, { foreignKey: "rol_id", as: "users" });
exports.PurchaseDB.belongsTo(exports.TypePaymentDB, { foreignKey: "type_payment_id", as: "type_payment" });
exports.TypePaymentDB.hasMany(exports.PurchaseDB, { foreignKey: "type_payment_id", as: "purchases" });
exports.PurchaseDB.belongsTo(exports.ProviderDB, { foreignKey: "provider_id", as: "provider" });
exports.ProviderDB.hasMany(exports.PurchaseDB, { foreignKey: "provider_id", as: "purchases" });
exports.PurchaseDB.belongsTo(exports.UserDB, { foreignKey: "user_ci", as: "user" });
exports.UserDB.hasMany(exports.PurchaseDB, { foreignKey: "user_ci", as: "purchases" });
exports.SaleDB.belongsTo(exports.TypePaymentDB, { foreignKey: "type_payment_id", as: "type_payment" });
exports.TypePaymentDB.hasMany(exports.SaleDB, { foreignKey: "type_payment_id", as: "sales" });
exports.SaleDB.belongsTo(exports.ClientDB, { foreignKey: "client_ci", as: "client" });
exports.ClientDB.hasMany(exports.SaleDB, { foreignKey: "client_ci", as: "sales" });
exports.SaleDB.belongsTo(exports.UserDB, { foreignKey: "user_ci", as: "user" });
exports.UserDB.hasMany(exports.SaleDB, { foreignKey: "user_ci", as: "sales" });
// Un registro de StockGeneral pertenece a un Producto
exports.StockGeneralDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede tener múltiples registros de stock (uno por almacén)
exports.ProductDB.hasMany(exports.StockGeneralDB, { foreignKey: "product_id", as: "stock_generals" });
// Un registro de StockGeneral pertenece a un Almacén (Depot)
exports.StockGeneralDB.belongsTo(exports.DepotDB, { foreignKey: "depot_id", as: "depot" });
// Un Almacén (Depot) puede tener múltiples registros de stock (uno por producto)
exports.DepotDB.hasMany(exports.StockGeneralDB, { foreignKey: "depot_id", as: "stock_generals" });
// Un Lote de Stock pertenece a un Producto
exports.StockLotDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede tener múltiples Lotes
exports.ProductDB.hasMany(exports.StockLotDB, { foreignKey: "product_id", as: "stock_lots" });
// Un Lote de Stock pertenece a un Almacén (Depot)
exports.StockLotDB.belongsTo(exports.DepotDB, { foreignKey: "depot_id", as: "depot" });
// Un Almacén (Depot) puede tener múltiples Lotes
exports.DepotDB.hasMany(exports.StockLotDB, { foreignKey: "depot_id", as: "stock_lots" });
// Un item de compra general pertenece a una Compra
exports.PurchaseGeneralItemDB.belongsTo(exports.PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
// Una Compra puede tener múltiples items generales
exports.PurchaseDB.hasMany(exports.PurchaseGeneralItemDB, { foreignKey: "purchase_id", as: "purchase_general_items" });
// Un item de compra general pertenece a un Producto
exports.PurchaseGeneralItemDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede estar en múltiples items de compras generales
exports.ProductDB.hasMany(exports.PurchaseGeneralItemDB, { foreignKey: "product_id", as: "purchase_general_items" });
// Un item de compra por lote pertenece a una Compra
exports.PurchaseLotItemDB.belongsTo(exports.PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
// Una Compra puede tener múltiples items por lote
exports.PurchaseDB.hasMany(exports.PurchaseLotItemDB, { foreignKey: "purchase_id", as: "purchase_lot_items" });
// Un item de compra por lote pertenece a un Producto
exports.PurchaseLotItemDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede estar en múltiples items de compras por lote
exports.ProductDB.hasMany(exports.PurchaseLotItemDB, { foreignKey: "product_id", as: "purchase_lot_items" });
// Un item de compra por lote pertenece a una Compra
exports.PurchaseLotItemDB.belongsTo(exports.PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
// Una Compra puede tener múltiples items por lote
exports.PurchaseDB.hasMany(exports.PurchaseLotItemDB, { foreignKey: "purchase_id", as: "purchase_lot_items" });
// Un item de compra por lote pertenece a un Producto
exports.PurchaseLotItemDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede estar en múltiples items de compras por lote
exports.ProductDB.hasMany(exports.PurchaseLotItemDB, { foreignKey: "product_id", as: "purchase_lot_items" });
exports.SaleDetailDB.belongsTo(exports.SaleDB, { foreignKey: "sale_id", as: "sale" });
exports.SaleDB.hasMany(exports.SaleDetailDB, { foreignKey: "sale_id", as: "sale_details" });
exports.SaleDetailDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
exports.ProductDB.hasMany(exports.SaleDetailDB, { foreignKey: "product_id", as: "sale_details" });
// --- 4. EXPORTA LA FUNCIÓN DE SINCRONIZACIÓN ---
const syncDatabase = async (options) => {
    try {
        await sequelize_config_1.db.sync(options); // Pasa las opciones directamente
        console.log("🔄 Database synchronized successfully.");
    }
    catch (error) {
        console.error("❌ Error synchronizing the database:", error);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
