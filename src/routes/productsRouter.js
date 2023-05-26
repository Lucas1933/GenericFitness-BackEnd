import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../dao/mongo/managers/productManager.js";

const pm = new ProductManager();
const productsRouter = Router();

const validatePost = async (req, res, next) => {
  try {
    let { title, description, price, thumbnail, code, stock, id } = req.body;
    const contentType = req.get("Content-Type");
    if (id) {
      throw new Error("id's can't be added");
    }
    if (typeof code != "string") {
      throw new TypeError("code must be a string");
    }
    if (await pm.validateCode(code)) {
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

    next();
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
const validatePut = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { title, description, price, status, thumbnail, code, stock, id } =
      req.body;

    if (id) {
      throw new Error("id's can't be updated");
    }
    if (code) {
      if (await pm.validateCode(code)) {
        throw new Error(`a product with the code ${code} already exists`);
      }
    }

    await pm.updateProduct(productId, {
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
    next();
  } catch (error) {
    res.errorCode = 400;
    next(error);
  }
};
productsRouter.get("/", validateGet, async (req, res) => {
  try {
    const products = await pm.getProducts();
    const requestedProducts = products.slice(0, req.query.limit);
    return res.status(200).send({ status: "200", payload: requestedProducts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: "500", error: "internal server error" });
  }
});
productsRouter.post("/", validatePost, async (req, res) => {
  try {
    const io = req.app.get("socketio");
    const product = req.product;
    await pm.addProduct(product);
    io.emit("updateProducts", await pm.getProducts());
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
productsRouter.get("/:productId", validateGet, async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.productId);
    return res.status(200).send({ status: "success", payload: product });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
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
productsRouter.delete("/:productId", validateDelete, async (req, res) => {
  try {
    const io = req.app.get("socketio");
    io.emit("updateProducts", await pm.getProducts());

    await pm.deleteProduct(req.params.productId);
    return res
      .status(200)
      .send({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});

export default productsRouter;
