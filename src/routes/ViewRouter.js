import ViewController from "../controller/viewController.js";
import { BaseRouter } from "./baseRouter.js";
const viewController = new ViewController();
export default class ViewRouter extends BaseRouter {
  init() {
    this.get("/", this.handlePolicies(["PUBLIC"]), viewController.renderLogin);
    this.get(
      "/register",
      this.handlePolicies(["NO_AUTH"]),
      viewController.renderRegister
    );
    this.get(
      "/products",
      this.handlePolicies(["USER", "PREMIUM", "ADMIN"]),
      viewController.renderProducts
    );
    this.get(
      "/restore",
      this.handlePolicies(["NO_AUTH"]),
      viewController.renderRestore
    );
    this.get("/newpassword/:token", viewController.renderNewPassword);
    this.get("/carts/:cartId", viewController.renderCart);
  }
}
