import { Sequelize, type Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Nota: Asegúrate de que las variables en Railway se llamen IGUAL que aquí
// (DATABASE_NAME, DATABASE_USER, etc.)
const dbName: string = process.env.DATABASE_NAME!;
const dbUser: string = process.env.DATABASE_USER!;
const dbPassword: string = process.env.DATABASE_PASSWORD!;
const dbDialect: Dialect = process.env.DATABASE_DIALECT as Dialect;
const dbHost: string = process.env.DATABASE_HOST!;
const dbPort: number = Number(process.env.DATABASE_PORT);

const sequelizeConfig: any = {
    dialect: dbDialect,
    host: dbHost,
    port: dbPort, // Es mejor ponerlo aquí directamente
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
        // Inicialmente vacío, lo llenamos abajo si es necesario
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

// ============================================================
// 🔒 LÓGICA DE SEGURIDAD (CRUCIAL PARA RAILWAY)
// ============================================================
// Si el host NO es localhost, asumimos que es producción (Nube)
// y activamos SSL.
if (dbHost && dbHost !== "localhost") {
    sequelizeConfig.dialectOptions.ssl = {
        require: true,
        rejectUnauthorized: false // Necesario para certificados autofirmados de Railway
    };
}

export const db = new Sequelize(dbName, dbUser, dbPassword, sequelizeConfig);