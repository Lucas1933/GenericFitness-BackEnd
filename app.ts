import express from "express";
import ProductManager from "./dist/productManager.js";
const app = express();
const port = 8080;
const pm = new ProductManager("./data/products.json");
app.get("/", (req, res) => {
  res.send("Product Manager implementetion with express");
});

app.get("/products", (req, res) => {
  const products = pm.getProducts();
  if (req.query.limit === undefined) {
    res.status(200).send(products);
  }
  const limit = parseInt(req.query.limit as string);
  if (limit > products.length || limit <= 0 || isNaN(limit)) {
    res.status(400).send({ error: "limit invalid" });
  }
  const limitedProducts = products.slice(0, limit);
  res.status(200).send(limitedProducts);
});
app.get("/products/:productId", (req, res) => {
  const product = pm.getProductById(parseInt(req.params.productId as string));
  if (!product) {
    res.status(400).send({ error: "product not found, check id" });
  }
  res.status(200).send(product);
});
app.listen(port, () => {
  console.log(`server running and listening in port ${port}`);
});
