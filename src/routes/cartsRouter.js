import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
const cartsRouter = Router();

const cm = new CartManager();
const pm = new ProductManager();
/* for testing purposes */
cartsRouter.get("/", async (req, res) => {
  const carts = await cm.getAllCarts();
  res.send(carts);
});
cartsRouter.get("/:cartId", async (req, res) => {
  try {
    const cart = await cm.getCart(req.params.cartId);
    res.status(200).send({ status: "200", payload: cart.products });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.post("/", async (req, res) => {
  try {
    const result = await cm.createCart();
    res
      .status(201)
      .send({
        message: "cart created sucessfully",
        status: "201",
        payload: result,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.post("/:cartId/product/:productId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    await cm.addProduct(cartId, productId);
    return res.status(200).send({
      status: "200",
      message: "product added to the cart successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.put("/:cartId", async (req, res) => {
  try {
    const cart = await cm.fillCart(req.params.cartId, req.body);
    return res.status(200).send({
      status: "200",
      message: "Cart filled",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});
cartsRouter.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const cart = await cm.updateProduct(
      req.params.cartId,
      req.params.productId,
      req.body.quantity
    );
    return res.status(200).send({
      status: "200",
      message: "Product updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});
/* for testing purposes */
cartsRouter.delete("/", async (req, res) => {
  const carts = await cm.deleteCart(req.query.cartId);
  res.send(`cart with id ${req.query.cartId} was deleted`);
});

cartsRouter.delete("/:cartId", async (req, res) => {
  const cart = await cm.emptyCart(req.params.cartId);
  return res
    .status(200)
    .send({ status: "200", message: "cart emptied sucessfully" });
});
cartsRouter.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const cart = await cm.deleteProduct(
      req.params.cartId,
      req.params.productId
    );
    return res
      .status(200)
      .send({ status: "200", message: "product deleted sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: "500", error: "internal server error" });
  }
});
export default cartsRouter;
