import { Router } from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../managers/productManager.js";
const productsFilePath = path.join(__dirname, "../data/products.json");
const pm = new ProductManager(productsFilePath);
const productsRouter = Router();
productsRouter.get("/", (req, res) => {
  const products = pm.getProducts();
  let limit = req.query.limit;
  if (req.query.limit === undefined) {
    return res.status(200).send(products);
  }

  if (limit.length !== 1) {
    limit = NaN;
  } else {
    limit = parseInt(req.query.limit);
  }

  if (limit > products.length || limit <= 0 || isNaN(limit)) {
    return res.status(400).send({ error: "limit invalid" });
  }
  const limitedProducts = products.slice(0, limit);
  return res.status(200).send(limitedProducts);
});
productsRouter.get("/:productId", (req, res) => {
  const product = pm.getProductById(parseInt(req.params.productId));
  if (product === null) {
    return res.status(400).send({ error: "Id invalid" });
  }
  return res.status(200).send(product);
});
productsRouter.post("/", (req, res) => {
  const { title, description, price, status, thumbnail, code, stock, id } =
    req.body;
  if (id) {
    return res.status(400).send({ error: "id's can't be updated" });
  }
  let result = pm.addProduct(
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock
  );
  if (!result) {
    return res
      .status(400)
      .send({ error: "one or more of the arguments are invalid" });
  }
  return res
    .status(200)
    .send({ message: "Product added successfully", status: "success" });
});
productsRouter.put("/:productId", (req, res) => {
  const productId = req.params.productId;
  const { title, description, price, status, thumbnail, code, stock, bodyId } =
    req.body;
  if (bodyId) {
    return res.status(400).send({ error: "id's can't be updated" });
  }
  if (
    pm.updateProduct(productId, {
      title: title,
      description: description,
      price: price,
      status: status,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    })
  ) {
    res
      .status(200)
      .send({ message: "Product updated successfully", status: "success" });
  } else {
    res.status(400).send({ error: "one or more of the arguments are invalid" });
  }
});
productsRouter.delete("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  if (isNaN(productId)) {
    return res.status(400).send({ error: "Id invalid" });
  }
  if (pm.deleteProduct(productId)) {
    return res
      .status(200)
      .send({ message: "Product deleted successfully", status: "success" });
  } else {
    res.status(400).send({ error: "something went wrong, check id" });
  }
});
export default productsRouter;
