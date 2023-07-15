import CartService from "../service/cartService.js";

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }
  getCarts(req, res) {
    const carts = this.cartService.getAllCarts();
    res.send(carts);
  }

  getCartById(req, res) {
    try {
      const cart = this.cartService.getCartById(req.params.cartId);
      res.status(200).send({ status: "200", payload: cart.products });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  createCart(req, res) {
    try {
      const result = this.cartService.createCart();
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

  addProduct(req, res) {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;

      this.cartService.addProduct(cartId, productId);
      return res.status(200).send({
        status: "200",
        message: "product added to the cart successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  fillCart(req, res) {
    try {
      const cart = this.cartService.fillCart(req.params.cartId, req.body);
      return res.status(200).send({
        status: "200",
        message: "Cart filled",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  }

  updateProduct(req, res) {
    try {
      const cart = this.cartService.updateProduct(
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

  deleteByQuery(req, res) {
    const carts = this.cartService.deleteCart(req.query.cartId);
    res.send(`cart with id ${req.query.cartId} was deleted`);
  }

  emptyCart(req, res) {
    const cart = this.cartService.emptyCart(req.params.cartId);
    return res
      .status(200)
      .send({ status: "200", message: "cart emptied sucessfully" });
  }

  deleteProduct(req, res) {
    try {
      const cart = this.cartService.removeProduct(
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
