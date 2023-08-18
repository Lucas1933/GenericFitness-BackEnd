import { BaseRouter } from "./baseRouter.js";
import ProductController from "../controller/productController.js";
const productController = new ProductController();
export default class ProductRouter extends BaseRouter {
  init() {
    this.get(
      "/",
      this.handlePolicies(["ADMIN"]),
      productController.getPaginatedProducts
    );
    this.post(
      "/",
      this.handlePolicies(["ADMIN", "PREMIUM"]),
      productController.createProduct
    );
    this.get(
      "/:productId",
      this.handlePolicies(["ADMIN"]),
      productController.getProductById
    );
    this.put(
      "/:productId",
      this.handlePolicies(["ADMIN"]),
      productController.updateProduct
    );
    this.delete(
      "/:productId",
      this.handlePolicies(["ADMIN"]),
      productController.deleteProduct
    );
  }
}
