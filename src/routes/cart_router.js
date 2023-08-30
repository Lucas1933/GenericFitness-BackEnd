import { BaseRouter } from "./base_router.js";
import CartController from "../controller/cart_controller.js";
const cartController = new CartController();
export default class CartRouter extends BaseRouter {
  init() {
    this.get(
      "/:cartId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.getCartById
    );
    this.put(
      "/:cartId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.fillCart
    );
    this.delete(
      "/empty/:cartId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.emptyCart
    );
    this.post(
      "/purchase/:cartId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.purchase
    );

    this.post(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.addProduct
    );
    this.put(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.updateProduct
    );
    this.delete(
      "/:cartId/product/:productId",
      this.handlePolicies(["USER", "PREMIUM"]),
      cartController.deleteProduct
    );
  }
}
