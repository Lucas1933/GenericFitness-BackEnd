import { cartService } from "../service/index.js";
export default class CartController {
  async getCarts(req, res) {
    const carts = await cartService.getAllCarts();
    res.send(carts);
  }

  async getCartById(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.cartId);
      res.status(200).send({ status: "200", payload: cart.products });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  async createCart(req, res) {
    try {
      const result = await cartService.createCart();
      res.status(201).send({
        message: "cart created sucessfully",
        status: "201",
        payload: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  async addProduct(req, res) {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      const updatedCart = await cartService.addProduct(cartId, productId);
      return res.status(200).send({
        status: "200",
        message: "product added to the cart successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  async fillCart(req, res) {
    try {
      const cart = await cartService.fillCart(req.params.cartId, req.body);
      return res.status(200).send({
        status: "200",
        message: "Cart filled",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const cart = await cartService.updateProduct(
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
  }

  async deleteCart(req, res) {
    const cart = await cartService.deleteCart(req.params.cartId);
    return res.send(`cart with id ${req.params.cartId} was deleted`);
  }

  async emptyCart(req, res) {
    const cart = await cartService.emptyCart(req.params.cartId);
    return res
      .status(200)
      .send({ status: "200", message: "cart emptied sucessfully" });
  }

  deleteProduct(req, res) {
    try {
      const cart = cartService.removeProduct(
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
  }
}
