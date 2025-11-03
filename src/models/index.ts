/*export * from "./category.model";
export * from "./client.model";
export * from "./depot.model";
export * from "./movement.model";
export * from "./product.model";
export * from "./provider.model";
export * from "./purchase.model";
export * from "./purchase-detail.model";
export * from "./rol.model";
export * from "./sale.model";
export * from "./sale-detail.model";
export * from "./type-payment.model";
export * from "./user.model";*/
import { type SyncOptions } from "sequelize";
import { db } from "../config/sequelize.config";

// --- 1. IMPORTA TODAS LAS "FACTORIES" DE TUS MODELOS ---
import { CategoryFactory } from "./category.model";
import { ClientFactory } from "./client.model";
import { DepotFactory } from "./depot.model";
import { MovementFactory } from "./movement.model";
import { ProductFactory } from "./product.model";
import { ProviderFactory } from "./provider.model";
import { PurchaseFactory } from "./purchase.model";
import { PurchaseGeneralItemFactory } from "./purchase-general-item.model";
import { PurchaseLotItemFactory } from "./purchase-lot-item.model";
import { RolFactory } from "./rol.model";
import { SaleFactory } from "./sale.model";
import { SaleDetailFactory } from "./sale-item.model";
import { StockGeneralFactory } from "./stock-general.model";
import { StockLotFactory } from "./stock-lot.model";
import { TypePaymentFactory } from "./type-payment.model";
import { UserFactory } from "./user.model";

// --- 2. INICIALIZA LOS MODELOS EN ORDEN DE DEPENDENCIA ---

// Nivel 1: Modelos que no dependen de otros
export const CategoryDB = CategoryFactory(db);
export const ClientDB = ClientFactory(db);
export const DepotDB = DepotFactory(db);
export const ProviderDB = ProviderFactory(db);
export const RolDB = RolFactory(db);
export const TypePaymentDB = TypePaymentFactory(db);

// Nivel 2: Modelos que dependen del Nivel 1
export const ProductDB = ProductFactory(db);   // Depende de Category
export const UserDB = UserFactory(db);         // Depende de Rol

// Nivel 3: Modelos de Transacciones que dependen de Nivel 1 y 2
export const PurchaseDB = PurchaseFactory(db); // Depende de Provider, User, TypePayment
export const MovementDB = MovementFactory(db); // Depende de Depot, Product
export const SaleDB = SaleFactory(db);         // Depende de Client, User, TypePayment
export const StockGeneralDB = StockGeneralFactory(db); // Depende de Product, Depot
export const StockLotDB = StockLotFactory(db); // Depende de Product, Depot

// Nivel 4: Modelos de Detalle que dependen de Nivel 3
export const PurchaseGeneralItemDB = PurchaseGeneralItemFactory(db); // Depende de Purchase, Product
export const PurchaseLotItemDB = PurchaseLotItemFactory(db); // Depende de Purchase, Product
export const SaleDetailDB = SaleDetailFactory(db);         // Depende de Sale, Product


// --- 3. DEFINE TODAS LAS RELACIONES ---
console.log("Defining model relationships...");

ProductDB.belongsTo(CategoryDB, { foreignKey: "category_id", as: "category" });
CategoryDB.hasMany(ProductDB, { foreignKey: "category_id", as: "products" });

MovementDB.belongsTo(DepotDB, { foreignKey: "depot_id", as: "depot" });
DepotDB.hasMany(MovementDB, { foreignKey: "depot_id", as: "movements" });

MovementDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
ProductDB.hasMany(MovementDB, { foreignKey: "product_id", as: "movements" });

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

// Un registro de StockGeneral pertenece a un Producto
StockGeneralDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede tener múltiples registros de stock (uno por almacén)
ProductDB.hasMany(StockGeneralDB, { foreignKey: "product_id", as: "stock_generals" });

// Un registro de StockGeneral pertenece a un Almacén (Depot)
StockGeneralDB.belongsTo(DepotDB, { foreignKey: "depot_id", as: "depot" });
// Un Almacén (Depot) puede tener múltiples registros de stock (uno por producto)
DepotDB.hasMany(StockGeneralDB, { foreignKey: "depot_id", as: "stock_generals" });

// Un Lote de Stock pertenece a un Producto
StockLotDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede tener múltiples Lotes
ProductDB.hasMany(StockLotDB, { foreignKey: "product_id", as: "stock_lots" });

// Un Lote de Stock pertenece a un Almacén (Depot)
StockLotDB.belongsTo(DepotDB, { foreignKey: "depot_id", as: "depot" });
// Un Almacén (Depot) puede tener múltiples Lotes
DepotDB.hasMany(StockLotDB, { foreignKey: "depot_id", as: "stock_lots" });

// Un item de compra general pertenece a una Compra
PurchaseGeneralItemDB.belongsTo(PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
// Una Compra puede tener múltiples items generales
PurchaseDB.hasMany(PurchaseGeneralItemDB, { foreignKey: "purchase_id", as: "purchase_general_items" });

// Un item de compra general pertenece a un Producto
PurchaseGeneralItemDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product"});
// Un Producto puede estar en múltiples items de compras generales
ProductDB.hasMany(PurchaseGeneralItemDB, { foreignKey: "product_id", as: "purchase_general_items" });

// Un item de compra por lote pertenece a una Compra
PurchaseLotItemDB.belongsTo(PurchaseDB, { foreignKey: "purchase_id", as: "purchase" });
// Una Compra puede tener múltiples items por lote
PurchaseDB.hasMany(PurchaseLotItemDB, { foreignKey: "purchase_id", as: "purchase_lot_items" });

// Un item de compra por lote pertenece a un Producto
PurchaseLotItemDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
// Un Producto puede estar en múltiples items de compras por lote
ProductDB.hasMany(PurchaseLotItemDB, { foreignKey: "product_id", as: "purchase_lot_items" });

SaleDetailDB.belongsTo(SaleDB, { foreignKey: "sale_id", as: "sale" });
SaleDB.hasMany(SaleDetailDB, { foreignKey: "sale_id", as: "sale_details" });

SaleDetailDB.belongsTo(ProductDB, { foreignKey: "product_id", as: "product" });
ProductDB.hasMany(SaleDetailDB, { foreignKey: "product_id", as: "sale_details" });

// Un item de compra general (no perecedero) pertenece a un Almacén (Depot)
PurchaseGeneralItemDB.belongsTo(DepotDB, { 
    foreignKey: "depot_id", 
    as: "depot" 
});

// Un Almacén (Depot) puede tener múltiples items de compra generales
DepotDB.hasMany(PurchaseGeneralItemDB, { 
    foreignKey: "depot_id", 
    as: "purchase_general_items" 
});


// Un item de compra por lote (perecedero) pertenece a un Almacén (Depot)
PurchaseLotItemDB.belongsTo(DepotDB, { 
    foreignKey: "depot_id", 
    as: "depot" 
});

// Un Almacén (Depot) puede tener múltiples items de compra por lote
DepotDB.hasMany(PurchaseLotItemDB, { 
    foreignKey: "depot_id", 
    as: "purchase_lot_items" 
});


// --- 4. EXPORTA LA FUNCIÓN DE SINCRONIZACIÓN ---
export const syncDatabase = async (options?: SyncOptions) => {
    try {
        await db.sync(options); // Pasa las opciones directamente
        console.log("🔄 Database synchronized successfully.");
    } catch (error) {
        console.error("❌ Error synchronizing the database:", error);
        throw error;
    }
};
