import "dotenv/config";
import { db } from "src/config";

const resetDatabase = async () => {
    console.log("⚠️  WARNING: Resetting the database... All data will be lost.");
    try {
        // force: true will DROP all tables and recreate them
        await db.sync({ force: true });
        console.log("🔄 Database has been reset successfully. All tables are empty.");
    } catch (error) {
        console.error("❌ Error resetting the database:", error);
        throw error;
    }
};

const main = async () => {
    try {
        await resetDatabase();
        process.exit(0);
    } catch (error) {
        console.error("The reset script failed:", error);
        process.exit(1);
    } 
};

// Start execution
main();