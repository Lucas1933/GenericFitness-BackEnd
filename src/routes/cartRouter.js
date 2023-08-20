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
    this.post(
      "/product/:productId/:cartId",
      this.handlePolicies(["USER"]),
      cartController.addProduct
    );
    this.put(
      "/product/:productId/:cartId",
      this.handlePolicies(["USER"]),
      cartController.updateProduct
    );
    this.delete(
      "/product/:productId/:cartId",
      this.handlePolicies(["USER"]),
      cartController.deleteProduct
    );
    this.post(
      "/purchase/:cartId",
      this.handlePolicies(["USER"]),
      cartController.purchase
    );
    this.delete(
      "/empty/:cartId",
      this.handlePolicies(["USER"]),
      cartController.emptyCart
    );
  }
}
