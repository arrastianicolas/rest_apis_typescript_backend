import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

// Desde Render , PostgreSQL
// le pasamos los modelos osea las entidades de la carpeta models, (codefirst)
const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + "/../models/**/*"],
  logging: false,
});

//Error SLL/TSL Required , dos opciones
//"postgresql://rest_api_node_typescript_4477_user:ugSj2XA3eqi15CUTCQ8HBKu1x388652k@dpg-d0ecu1p5pdvs73b0ftc0-a.virginia-postgres.render.com/rest_api_node_typescript_4477"
// , {
// dialectOptions:{
//        ssl: {
//         require: false
// }
//  }
// }

export default db;
