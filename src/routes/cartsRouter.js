import { Router } from "express";
import __dirname from "../utils.js";
import path from "path";
import CartManager from "../managers/cartManager.js";
import ProductManager from "../managers/productManager.js";
const cartsRouter = Router();
const cartsFilePath = path.join(__dirname, "../data/carts.json");
const productsFilePath = path.join(__dirname, "../data/products.json");
const cm = new CartManager(cartsFilePath);
const pm = new ProductManager(productsFilePath);
cartsRouter.get("/:cartId", (req, res) => {
  try {
    const products = cm.getCart(req.params.cartId).products;
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.post("/", (req, res) => {
  try {
    cm.createCart();
    res
      .status(200)
      .send({ message: "cart created sucessfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.post("/:cartId/product/:productId", (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const product = pm.getProductById(productId);
    if (!product) {
      throw new Error(`the product with id ${productId} does not exists`);
    }
    cm.addProduct(cartId, productId);
    return res.status(200).send({
      message: "product added to the cart successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

export default cartsRouter;
