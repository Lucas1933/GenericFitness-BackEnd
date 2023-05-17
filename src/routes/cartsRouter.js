import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
/* import path from "path";
import CartManager from "../dao/fileSystem/managers/cartManager.js";
import ProductManager from "../dao/fileSystem/managers/productManager.js"; */
const cartsRouter = Router();
/* const cartsFilePath = path.join(__dirname, "./dao/fileSystem/data/carts.json");
const productsFilePath = path.join(
  __dirname,
  "./dao/fileSystem/data/products.json"
); */
/* const cm = new CartManager(cartsFilePath);
const pm = new ProductManager(productsFilePath); */
const cm = new CartManager();
const pm = new ProductManager();
/* for testing purposes */
cartsRouter.get("/", async (req, res) => {
  const carts = await cm.getAllCarts();
  res.send(carts);
});
cartsRouter.post("/", async (req, res) => {
  try {
    await cm.createCart();
    res
      .status(200)
      .send({ message: "cart created sucessfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.post("/:cartId/product/:productId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const product = await pm.getProductById(productId);
    if (!product) {
      throw new Error(`the product with id ${productId} does not exists`);
    }
    await cm.addProduct(cartId, productId);
    return res.status(200).send({
      status: "success",
      message: "product added to the cart successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.get("/:cartId", async (req, res) => {
  try {
    const cart = await cm.getCart(req.params.cartId);

    res.status(200).send({ status: "success", payload: cart.products });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

export default cartsRouter;
