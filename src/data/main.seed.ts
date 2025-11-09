import "dotenv/config"
import { db } from "src/config";
import {
    rolSeed,
    typePaymentSeed,
    categorySeed,
    depotSeed,
    clientSeed,
    providerSeed,
    userSeed,
    productSeed,
    purchaseSeed,
    purchaseGeneralItemSeed,
    purchaseLotItemSeed,
    saleSeed,
    saleItemSeed,
    stockGeneralSeed,
    stockLotSeed,
    movementSeed,
    permissionSeed,
    rolePermissionSeed
} from './seeders';

export const mainSeed = async () => {
    try {
        console.log("🚀 Starting the full seeding process...");

        // --- LEVEL 1: Models without dependencies ---
        console.log("\n--- Running Level 1: Base Data ---");
        await permissionSeed();
        await rolSeed();
        await typePaymentSeed();
        await categorySeed();
        await depotSeed();
        await clientSeed();
        await providerSeed();

        // --- LEVEL 2: Models dependent on Level 1 ---
        console.log("\n--- Running Level 2: Users and Products ---");
        await userSeed();      // Depends on 'rolSeed'
        await productSeed();   // Depends on 'categorySeed'
        await rolePermissionSeed();   // Depends on 'categorySeed'

        // --- LEVEL 3: Transaction Models (Headers) ---
        console.log("\n--- Running Level 3: Transactions ---");
        await purchaseSeed();  // Depends on 'providerSeed', 'userSeed', 'typePaymentSeed'
        await saleSeed();      // Depends on 'clientSeed', 'userSeed', 'typePaymentSeed'
        await movementSeed();  // Depends on 'depotSeed', 'productSeed'
        await stockGeneralSeed(); // Depends on 'productSeed' and 'depotSeed'
        await stockLotSeed();     // Depends on 'productSeed' and 'depotSeed'

        // --- LEVEL 4: Transaction Detail Models ---
        console.log("\n--- Running Level 4: Transaction Details ---");
        await purchaseGeneralItemSeed(); // Depends on 'purchaseSeed' and 'productSeed'
        await purchaseLotItemSeed();     // Depends on 'purchaseSeed' and 'productSeed'
        await saleItemSeed();     // Depends on 'saleSeed' and 'productSeed'

        console.log("\n✅ Seeding process completed successfully.");

    } catch (error) {
        console.error("❌ Catastrophic error during the seeding process:", error);
        throw error; // Propagate the error to stop any subsequent process
    }
};

const resetDatabase = async () => {
    console.log("⚠️  WARNING: Resetting the database... All data will be lost.");
    try {
        // force: true will DROP all tables and recreate them
        await db.sync({ force: true });
        console.log("🔄 Database reset successfully.");
    } catch (error) {
        console.error("❌ Error resetting the database:", error);
        throw error;
    }
};

const runSeeders = async () => {
    try {
        console.log("Running seeders...")
        await db.authenticate()
        console.log("Successfully connected to the database")

        await mainSeed()
        console.log("Seeders executed successfully")
    } catch (error) {
        console.error("Error during seeder execution:", error)

        throw error
    }
}

const main = async () => {
    try {
        const shouldReset = process.argv.includes('--reset');

        if (shouldReset) {
            await resetDatabase();
        }

        await runSeeders()

        console.log("Seeder script finished successfully.")
        process.exit(0)
    } catch (error) {
        console.error("The seeder script failed:", error)
        process.exit(1)
    }
}

// Start execution
main();