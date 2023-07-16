import { BaseRouter } from "./baseRouter.js";
import CartController from "../controller/cartController.js";
const cartController = new CartController();
export default class CartRouter extends BaseRouter {
  init() {
    this.get("/", cartController.getCarts);
    this.post("/", cartController.createCart);
    this.delete("/:cartId", cartController.deleteCart);
    this.get("/:cartId", cartController.getCartById);
    this.put("/:cartId", cartController.fillCart);
    this.delete("/empty/:cartId", cartController.emptyCart);
    this.post("/:cartId/product/:productId", cartController.addProduct);
    this.put("/:cartId/products/:productId", cartController.updateProduct);
    this.delete("/:cartId/products/:productId", cartController.deleteProduct);
  }
}
