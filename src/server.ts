import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";
import { swaggerUiOptions } from "./config/swagger";

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.green.bold("conexion exitosa a la base de datos"));
  } catch (error) {
    console.log(colors.red.bold("Hubo un error al conectar a la DB"));
  }
}
connectDB();
//Instancia de express
const server = express();
// Permititr conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (
      origin === process.env.FRONTEND_URL ||
      origin === process.env.BACKEND_URL
    ) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"), false);
    }
  },
};

server.use(cors(corsOptions));
//leer datos de formularios
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router);

//Docs

server.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
