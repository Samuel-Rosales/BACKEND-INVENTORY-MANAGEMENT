import { Sequelize, type Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dbName: string = process.env.DATABASE_NAME!;
const dbUser: string = process.env.DATABASE_USER!;
const dbPassword: string = process.env.DATABASE_PASSWORD!;
const dbDialect: Dialect = process.env.DATABASE_DIALECT as Dialect;
const dbHost: string = process.env.DATABASE_HOST!;
const dbPort: number = Number(process.env.DATABASE_PORT);

// Configuración de Sequelize (con los typos corregidos)
const sequelizeConfig: any = {
    dialect: dbDialect,
    host: dbHost,
    logging: false,
    dialectOptions: { // Corregido de 'dialectOpions'
        connectTimeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

if (dbHost !== "localhost") {
    sequelizeConfig.port = dbPort;
}

// Se crea y se exporta la instancia de Sequelize.
// Esta es la única responsabilidad principal de este archivo.
export const db = new Sequelize(dbName, dbUser, dbPassword, sequelizeConfig);