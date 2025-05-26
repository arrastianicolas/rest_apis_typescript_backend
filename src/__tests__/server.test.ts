// describe("Nuestro Primer test", () => {
//   //test() o it() para testear una función
//   it("Debe revisar que 1 + 1 sea igual a 2", () => {
//     //expect() para hacer una afirmacion
//     //toBe() para comparar el resultado que esperamos
//     expect(1 + 1).toBe(2);
//   });
//   it("Debe revisar que 1 + 1 no sea igual a 3", () => {
//     expect(1 + 1).not.toBe(3);
//   });
// });

import { connectDB } from "../server";
import db from "../config/db";

jest.mock("../config/db"); // => Crea un nuevo archivo config en entorno de testeo

describe("connectDB", () => {
  it("should handle database connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(new Error("Hubo un error al conectar a la DB"));
    const consoleSpy = jest.spyOn(console, "log");

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar a la DB")
    );
  });
});
