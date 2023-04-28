import { Router } from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../managers/productManager.js";
const productsFilePath = path.join(__dirname, "../data/products.json");
const pm = new ProductManager(productsFilePath);
const productsRouter = Router();

const postValidation = (req, res, next) => {
  let { title, description, price, thumbnail, code, stock, id } = req.body;
  const contentType = req.get("Content-Type");
  if (id) {
    return res.status(400).send({ error: "id's can't be added" });
  }
  if (typeof code != "string") {
    return res.status(400).send({ error: "code must be a string" });
  }
  if (pm.validateCode(code)) {
    return res
      .status(400)
      .send({ error: `The product of code ${code} already exists` });
  }
  if (isNaN(price)) {
    return res.status(400).send({ error: "price must be a number" });
  }
  if (isNaN(stock)) {
    return res.status(400).send({ error: "stock must be a number" });
  }
  if (contentType === "application/x-www-form-urlencoded") {
    thumbnail = thumbnail.split(",");
  }
  if (!Array.isArray(thumbnail)) {
    return res.status(400).send({ error: "thumbnail must be an array" });
  }
  if (typeof title != "string") {
    return res.status(400).send({ error: "title must be a string" });
  }
  if (typeof description != "string") {
    return res.status(400).send({ error: "description must be a string" });
  }

  price = parseInt(price);
  stock = parseInt(stock);
  req.product = {
    title: title,
    description: description,
    price: price,
    thumbnail: thumbnail,
    code: code,
    stock: stock,
  };
  next();
};
productsRouter.get("/", (req, res) => {
  try {
    const products = pm.getProducts();
    let limit = req.query.limit;
    if (req.query.limit === undefined) {
      return res.status(200).send(products);
    }
    limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit > products.length || limit <= 0) {
      return res.status(400).send({ error: "limit invalid" });
    }
    const limitedProducts = products.slice(0, limit);
    return res.status(200).send(limitedProducts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.get("/:productId", (req, res) => {
  try {
    const product = pm.getProductById(parseInt(req.params.productId));
    if (product === null) {
      return res.status(400).send({ error: "Invalid id" });
    }
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.post("/", postValidation, (req, res) => {
  try {
    const io = req.app.get("socketio");
    const product = req.product;
    pm.addProduct(product);
    io.emit("updateProducts", pm.getProducts());
    return res
      .status(200)
      .send({ message: "Product added successfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
productsRouter.put("/:productId", (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      title,
      description,
      price,
      status,
      thumbnail,
      code,
      stock,
      bodyId,
    } = req.body;
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
      res.status(400).send({ error: "The id is invalid" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});
productsRouter.delete("/:productId", (req, res) => {
  try {
    const io = req.app.get("socketio");
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).send({ error: "id must be a number" });
    }
    if (pm.deleteProduct(productId)) {
      io.emit("updateProducts", pm.getProducts());
      return res
        .status(200)
        .send({ message: "Product deleted successfully", status: "success" });
    } else {
      res.status(400).send({ error: "something went wrong, check id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});

export default productsRouter;
