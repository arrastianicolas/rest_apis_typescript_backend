import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *        type: object
 *        properties:
 *            id:
 *                type: integer
 *                description: The product ID
 *                example: 1
 *            name:
 *                type: string
 *                description: The Product name
 *                example: Play 5 1TB
 *            price:
 *                type: number
 *                description: The Product price
 *                example: 500
 *            availability:
 *                type: boolean
 *                description: The Product availability
 *                example: true
 */
// Routing

/**
 * @swagger
 * /api/products:
 *    get:
 *        summary: Get a list of products
 *        tags:
 *            - Products
 *        description: Return a list of products
 *        responses:
 *            200:
 *               description: Succesful Response
 *               content:
 *                   application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                              $ref: "#/components/schemas/Product"
 *
 *
 *
 */

router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get a product by ID
 *        tags:
 *            - Products
 *        description: Return a product based on its unique ID
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *               type: integer
 *        responses:
 *            200:
 *               description: Succesful Response
 *               content:
 *                   application/json:
 *                        schema:
 *                             $ref: "#/components/schemas/Product"
 *            404:
 *              description: Product Not Found
 *            400:
 *              description: Bad Request - Invalid ID
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *    post:
 *        summary: Create a new Product
 *        tags:
 *            - Products
 *        description: Return a new record in the database
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                             name:
 *                                type: string
 *                                example: "Monitor Curvo Lg 24´"
 *                             price:
 *                               type: number
 *                               example: 240
 *        responses:
 *            201:
 *               description: Succesfull response
 *               content:
 *                   application/json:
 *                        schema:
 *                             $ref: "#/components/schemas/Product"
 *            400:
 *              description: Bad Request - Invalid ID
 */
router.post(
  "/",
  //VALIDACIÓN en este caso se usa body en los router o funciones no async
  body("name")
    .notEmpty()
    .withMessage("El nombre de Producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del Producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  //MIDDLEWARE
  handleInputErrors,
  //CONTROLADOR
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *        summary: Updates a product with user input
 *        tags:
 *            - Products
 *        description: Return the update product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *               type: integer
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                             name:
 *                                type: string
 *                                example: "Monitor Curvo Lg 24´"
 *                             price:
 *                               type: number
 *                               example: 240
 *                             availability:
 *                                  type: boolean
 *                                  example: true
 *        responses:
 *            200:
 *               description: Succesfull response
 *               content:
 *                   application/json:
 *                        schema:
 *                             $ref: "#/components/schemas/Product"
 *            404:
 *               description: Product Not Found
 *            400:
 *              description: Bad Request - Invalid ID or Invalid input Data
 */

router.put(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre de Producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del Producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no valido"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *        summary: Update Product availability
 *        tags:
 *            - Products
 *        description: Return the updated availability
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *               type: integer
 *        responses:
 *            200:
 *               description: Succesfull response
 *               content:
 *                   application/json:
 *                        schema:
 *                             $ref: "#/components/schemas/Product"
 *            404:
 *               description: Product Not Found
 *            400:
 *              description: Bad Request - Invalid ID
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  updateAvailability
);
/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *        summary: Delete a product by a given ID
 *        tags:
 *            - Products
 *        description: Returns a confirmation message
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *               type: integer
 *        responses:
 *            200:
 *               description: Succesfull response
 *               content:
 *                   application/json:
 *                        schema:
 *                             type: string
 *                             value: "Producto Eliminado"
 *            404:
 *               description: Product Not Found
 *            400:
 *              description: Bad Request - Invalid ID
 */
router.delete(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  deleteProduct
);

export default router;
