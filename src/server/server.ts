import express, { type Application } from "express"; 
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../config";

import { 
  CategoryRoute,
  DepotRoute,
  MovementRoute,
  ProductRoute,
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
      depots: this.pre + "/depot",
      movements: this.pre + "/movement",
      products: this.pre + "/product",
    }
    
    this.middlewares()
    this.routes()
    this.swaggerSetup()
  }

  middlewares() {
    this.app.use(cors({
      origin: "*", // o una lista segura de dominios
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }))

    this.app.use(express.json())
    this.app.use(express.static("src/public"))
    this.app.use(morgan("dev"))
  }

  routes() {
    this.app.use(this.paths.categories, CategoryRoute);
    this.app.use(this.paths.depots, DepotRoute);
    this.app.use(this.paths.movements, MovementRoute);
    this.app.use(this.paths.products, ProductRoute);
  }

  listen() {
    this.app.listen(this.port, () => {
      const URL = `${this.apiurl}/swagger/#`
      console.log(`Server running in ${URL}`)
    })
  }

  swaggerSetup() {
    const swaggerDocs = swaggerJSDoc(swaggerOptions)
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  }
}