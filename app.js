const express = require("express");
const { randomUUID } = require("crypto");
const { request } = require("http");
const { response, json } = require("express");
const fs = require("fs");

const app = express();

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});
app.use(express.json());

/*
 * POST => inserir um dado
 * GET => pegar um dado
 * PUT => alterar um dado
 * DELETE => remover um dado
 */
app.get("/", (request, response) => {
  return response.json(products);
});

app.post("/products", (request, response) => {
  const { name, price } = request.body;

  const product = {
    name,
    price,
    id: randomUUID(),
  };

  products.push(product);

  productFile();

  return response.json(products);
});

app.get("/products", (request, response) => {
  return response.json(products);
});

app.get("/products/:id", (request, response) => {
  const { id } = request.params;

  const product = products.find((product) => product.id === id);

  return response.json(product);
});

app.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { name, price } = request.body;
  const productIndex = products.findIndex((product) => product.id === id);

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };
  productFile();

  return response.json({ mensage: "produto alterado" });
});

app.delete("/products/:id", (request, response) => {
  const { id } = request.params;

  const productIndex = products.findIndex((product) => product.id === id);
  products.splice(productIndex, 1);
  productFile();
  return response.json({ mensage: "produto excluido" });
});

function productFile() {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("produto inserido");
    }
  });
}

app.listen(4002, () => console.log("rodando na porta 4002"));
