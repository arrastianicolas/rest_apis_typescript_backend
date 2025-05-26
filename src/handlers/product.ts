import { Request, Response } from "express";

import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
};
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  //validacion en el controlador o handler en este caso se usa await chek debido a la función async
  // await check("name")
  //   .notEmpty()
  //   .withMessage("El nombre de Producto no puede ir vacio")
  //   .run(req);
  // await check("price")
  //   .isNumeric()
  //   .withMessage("Valor no valido")
  //   .notEmpty()
  //   .withMessage("El precio del Producto no puede ir vacio")
  //   .custom((value) => value > 0)
  //   .withMessage("Precio no valido")
  //   .run(req);

  // let errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   res.status(400).json({ errors: errors.array() });
  //   return;
  // }
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    // la funcion update protege los campos que no se modificaron el body
    // Ej : si el body tiene name y price solo se actualizan esos campos y el resto se mantiene igual
    await product.update(req.body);
    await product.save();
    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    // la funcion update protege los campos que no se modificaron el body
    // Ej : si el body tiene name y price solo se actualizan esos campos y el resto se mantiene igual
    product.availability = !product.dataValues.availability;
    await product.save();
    res.json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    await product.destroy();
    //otra forma de eliminar seria cambiando el estado de otro campo llamado por ejemplo "visibilidad"

    res.json({ data: "Producto eliminado" });
  } catch (error) {
    console.log(error);
  }
};
