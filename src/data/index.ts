import { exit } from "node:process";
import db from "../config/db";

const clearDB = async () => {
  try {
    await db.sync({ force: true }); //force : true => elimina la base de datos y la vuelve a crear con datos vacios
    console.log("Datos eliminados correctamente");
    exit(0); // exit(0) => el cero significa que finaliza sin errores
  } catch (error) {
    console.log(error);
    exit(1); // exit(1) => el uno significa que finaliza con errores
  }
};
//
if (process.argv[2] === "--clear") {
  clearDB();
}
