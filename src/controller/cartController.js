import { cartService, ticketService } from "../service/index.js";
import { CREATED, OK } from "../utils/httpReponses.js";
export default class CartController {
  /* for testing purposes */
  async getCarts(req, res, next) {
    try {
      const carts = await cartService.getAllCarts();
      res.send(carts);
    } catch (error) {
      next(error);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cart = await cartService.getCartById(req.params.cartId);
      res.status(OK).send({ status: OK, payload: cart.products });
    } catch (error) {
      next(error);
    }
  }

  async createCart(req, res, next) {
    try {
      const result = await cartService.createCart();
      res.status(CREATED).send({
        status: CREATED,
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      const updatedCart = await cartService.addProduct(cartId, productId);
      return res.status(OK).send({
        status: OK,
        message: "product added to the cart successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async fillCart(req, res, next) {
    try {
      const cart = await cartService.fillCart(req.params.cartId, req.body);
      return res.status(OK).send({
        status: OK,
        message: "Cart filled",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const cart = await cartService.updateProduct(
        req.params.cartId,
        req.params.productId,
        req.body.quantity
      );
      return res.status(OK).send({
        status: OK,
        message: "Product updated",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCart(req, res, next) {
    try {
      const cart = await cartService.deleteCart(req.params.cartId);
      return res.status(OK).send({
        status: OK,
        message: `cart with id ${req.params.cartId} was deleted`,
      });
    } catch (error) {
      next(error);
    }
  }

  async emptyCart(req, res, next) {
    try {
      const cart = await cartService.emptyCart(req.params.cartId);
      return res
        .status(OK)
        .send({ status: OK, message: "cart emptied sucessfully" });
    } catch (error) {
      next(error);
    }
  }
  async purchase(req, res, next) {
    try {
      const amount = await cartService.getPurchaseAmount(req.params.cartId);
      const purchaser = req.user.email;
      const ticket = await ticketService.createTicket({
        amount,
        purchaser,
      });
      const unavailableProducts = await cartService.getProductsIds(
        req.params.cartId
      );
      /* send ticket to user*/
      res.status(OK).send({
        status: OK,
        message: "purchase completed",
        payload: { unavailableProducts },
      });
    } catch (error) {
      next(error);
    }
  }
  deleteProduct(req, res, next) {
    try {
      const cart = cartService.removeProduct(
        req.params.cartId,
        req.params.productId
      );
      return res
        .status(OK)
        .send({ status: OK, message: "product deleted sucessfully" });
    } catch (error) {
      next(error);
    }
  }
}
