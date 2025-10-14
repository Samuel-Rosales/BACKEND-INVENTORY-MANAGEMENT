import { Sequelize, type Dialect } from "sequelize";
import dotenv  from "dotenv";
dotenv.config();

import {
    ProductModel
} from "../models";
import { timeStamp } from "console";


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

const noTimeStampsOptions = {
    timestamps: false,
} 

//Models
export const ProductDB = db.define("products", ProductModel, {
    timestamps: true,
    tableName: "products",
});


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