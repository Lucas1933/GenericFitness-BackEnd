import { BaseRouter } from "./baseRouter.js";
import CartController from "../controller/cartController.js";
export default class CartRouter extends BaseRouter {
  constructor() {
    this.cartController = new CartController();
  }
  init() {
    this.get("/", this.cartController.getCarts);
    this.post("/", this.cartController.createCart);
    this.post("/:cartId/product/:productId", this.cartController.addProduct);
    this.get("/:cartId", this.cartController.getCartById);
    this.put("/:cartId", this.cartController.fillCart);
    this.put("/:cartId/products/:productId", this.cartController.updateProduct);
    this.delete("/", this.cartController.deleteByQuery);
    this.delete("/:cartId", this.cartController.emptyCart);
    this.delete(
      "/:cartId/products/:productId",
      this.cartController.deleteProduct
    );
  }
}
