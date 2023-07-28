import { BaseRouter } from "./baseRouter.js";
import TestController from "../controller/testController.js";
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
