import express, { type Application } from "express"; 
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../config";

//import { ProductRoute } from "../routes/index.route"; 

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
      products: this.pre + "/products"
    }

    this.swaggerSetup()
  }

  listen() {
    this.app.listen(this.port, () => {
      const URL = `${this.apiurl}/swagger/#`
      console.log(`Server running in ${URL}`)
    })
  }

  swaggerSetup() {
    const swaggerDocs = swaggerJSDoc(swaggerOptions)
    this.app.use("/swagger", swaggerUi.serv