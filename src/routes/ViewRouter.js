import ViewController from "../controller/viewController.js";
import { BaseRouter } from "./baseRouter.js";
const viewController = new ViewController();
export default class ViewRouter extends BaseRouter {
  init() {
    this.get("/", this.handlePolicies(["PUBLIC"]), viewController.renderLogin);
    this.get(
      "/register",
      this.handlePolicies(["PUBLIC"]),
      viewController.renderRegister
    );
    this.get(
      "/products",
      this.handlePolicies(["AUTHENTICATED"]),
      viewController.renderProducts
    );
    this.get("/chat", viewController.renderChat);
    this.get("/carts/:cartId", viewController.renderCart);
    this.get("/realtimeproducts", viewController.renderRealTimeProducts);
  }
}
