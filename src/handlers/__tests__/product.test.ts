import request from "supertest";
import server, { connectDB } from "../../server";

// TEST DE CREACIÓN DE PRODUCTOS
describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  // testeamos que el precio sea mayor a 0
  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo - Testing",
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });
  // testeamos que el precio sea un numero y mayor a 0
  it("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo - Testing",
      price: "hola",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse - testing",
      price: 20,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

// TEST DE OBTENCIÓN DE PRODUCTOS
describe("GET /api/products", () => {
  it("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });
  it("GET a json response with products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.body).not.toHaveProperty("errors");
  });
});

// TEST DE OBTENCIÓN DE PRODUCTOS POR ID
describe("GET /api/products/:id", () => {
  it("should return a 404 response for a non existent product", async () => {
    const productId = 2000;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });
  it("should check a valid ID in the URL", async () => {
    const response = await request(server).get("/api/products/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });
  it("GET a JSON response for a single product", async () => {
    const response = await request(server).get("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

// TEST DE ACTUALIZACÓN DE PRODUCTOS
describe("PUT /api/products/:id", () => {
  it("should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url")
      .send({
        name: "Monitor Curvo - Testing",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  it("should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should validate that the price is grater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor Curvo - Testing",
      availability: true,
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Precio no valido");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo - Testing",
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });
  it("GET a JSON response for a single product", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor Curvo 24 - Testing",
      availability: true,
      price: 380,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

//TEST DE ACTUALIZACIÓN DE DISPONIBILIDAD DEL PRODUCTO
describe("PATCH /api/products/:id", () => {
  it("should return a 404 response for a non-existing product", async () => {
    const productId = 2000;
    const response = await request(server).patch(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe("200");
    expect(response.body).not.toHaveProperty("data");
  });
  it("should update the product availability", async () => {
    const response = await request(server).patch("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("error");
  });
});

// TEST DE ELIMINACIÓN DE PRODUCTOS
describe("DELETE /api/products/:id", () => {
  it("should check a valid ID in the URL", async () => {
    const response = await request(server).delete(
      "/api/products/not-valid-url"
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Id no valido");

    expect(response.status).not.toBe("200");
    expect(response.body).not.toHaveProperty("data");
  });
  it("should return a 404 response for a non-existent product ", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");

    expect(response.status).not.toBe("200");
    expect(response.body).not.toHaveProperty("data");
  });
  it("should delete a product ", async () => {
    const response = await request(server).delete("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBe("Producto eliminado");

    expect(response.status).not.toBe("404");
    expect(response.status).not.toBe("400");
    expect(response.body).not.toHaveProperty("error");
  });
});
