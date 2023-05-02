import { Router } from "express";
import path from "path";
import __dirname from "../utils.js";
import ProductManager from "../managers/productManager.js";
const productsFilePath = path.join(__dirname, "../data/products.json");
const pm = new ProductManager(productsFilePath);
const productsRouter = Router();

const validatePost = (req, res, next) => {
  try {
    let { title, description, price, thumbnail, code, stock, id } = req.body;
    const contentType = req.get("Content-Type");
    if (id) {
      throw new Error("id's can't be added");
    }
    if (typeof code != "string") {
      throw new TypeError("code must be a string");
    }
    if (pm.validateCode(code)) {
      throw new Error(`The product of code ${code} already exists`);
    }
    if (isNaN(price)) {
      throw new TypeError("price must be a number");
    }
    if (isNaN(stock)) {
      throw new TypeError("price must be a number");
    }
    if (contentType === "application/x-www-form-urlencoded") {
      thumbnail = thumbnail.split(",");
    }
    if (!Array.isArray(thumbnail)) {
      throw new TypeError("thumbnail must be an array");
    }
    if (typeof title != "string") {
      throw new TypeError("title must be a string");
    }
    if (typeof description != "string") {
      throw new TypeError("description must be a string");
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
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
const validateGet = (req, res, next) => {
  try {
    if (req.query.limit != undefined) {
      const limit = parseInt(req.query.limit);
      if (isNaN(limit) || limit > pm.getProducts().length || limit <= 0) {
        throw new Error("limit invalid");
      }
    }
    if (req.params.productId != undefined) {
      req.params.productId = parseInt(req.params.productId);
      const product = pm.getProductById(req.params.productId);
      if (product === null) {
        throw new Error("invalid id");
      }
    }
    next();
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
const validatePut = (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const { title, description, price, status, thumbnail, code, stock, id } =
      req.body;
    if (id) {
      throw new Error("id's can't be updated");
    }
    const product = pm.getProductById(productId);
    if (product === null) {
      throw new Error("invalid id");
    }
    pm.updateProduct(productId, {
      title: title,
      description: description,
      price: price,
      status: status,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    });
    next();
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
const validateDelete = (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      throw new Error("id must be a number");
    }
    if (!pm.deleteProduct(productId)) {
      throw new Error("something went wrong, check id");
    }
    next();
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
productsRouter.get("/", validateGet, (req, res) => {
  try {
    const products = pm.getProducts();
    const requestedProducts = products.slice(0, req.query.limit);
    return res.status(200).send(requestedProducts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.get("/:productId", validateGet, (req, res) => {
  try {
    const product = pm.getProductById(req.params.productId);
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.post("/", validatePost, (req, res) => {
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
productsRouter.put("/:productId", validatePut, (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "Product updated successfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.delete("/:productId", validateDelete, (req, res) => {
  try {
    const io = req.app.get("socketio");
    io.emit("updateProducts", pm.getProducts());
    return res
      .status(200)
      .send({ message: "Product deleted successfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});

export default productsRouter;
