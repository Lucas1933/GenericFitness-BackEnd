import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import path from "path";
import __dirname from "../utils.js";
const productsFilePath = path.join(__dirname, "../data/products.json");
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
export default viewsRouter;
