import { BaseRouter } from "./baseRouter.js";
import CartController from "../controller/cartController.js";
const cartController = new CartController();
export default class CartRouter extends BaseRouter {
  init() {
    this.get(
      "/:cartId",
      this.handlePolicies(["USER"]),
      cartController.getCartById
    );
    this.put(
      "/:cartId",
      this.handlePolicies(["USER"]),
      cartController.fillCart
    );
    this.delete(
      "/empty/:cartId",
      this.handlePolicies(["USER"]),
      cartController.emptyCart
    );
    this.post(
      "/purchase/:cartId",
      this.handlePolicies(["USER"]),
      cartController.purchase
    );

    this.post(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER"]),
      cartController.addProduct
    );
    this.put(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER"]),
      cartController.updateProduct
    );
    this.delete(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER"]),
      cartController.deleteProduct
    );
  }
}
