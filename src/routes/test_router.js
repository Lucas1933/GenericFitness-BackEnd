import { BaseRouter } from "./base_router.js";
import TestController from "../controller/test_controller.js";
const testController = new TestController();
export default class TestRouter extends BaseRouter {
  init() {
    this.get(
      "/mockingproducts",
      this.handlePolicies(["ADMIN"]),
      testController.getMockedProducts
    );
  }
}
