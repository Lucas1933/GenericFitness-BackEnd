import { Router } from "express";
import ProductManager from "../dao/fileSystem/managers/productManager.js";
import path from "path";
import __dirname from "../utils.js";
const productsFilePath = path.join(
  __dirname,
  "./dao/fileSystem/data/products.json"
);
const pm = new ProductManager(productsFilePath);
const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
  const products = pm.getProducts();
  res.render("index", { products: products });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  const products = pm.getProducts();
  res.render("realTimeProducts", { products: products });
});

viewsRouter.get("/chat", (req, res) => {
  res.render("ecommerceChat");
});
export default viewsRouter;
