import { BaseRouter } from "./baseRouter.js";
import ProductController from "../controller/productController.js";
const productController = new ProductController();
export class ProductRouter extends BaseRouter {
  init() {
    this.get("/", productController.getProducts);
    this.post("/", productController.createProduct);
    this.get("/:productId", productController.getProductById);
    this.put("/:productId", productController.updateProduct);
    this.delete("/:productId", productController.deleteProduct);
  }
}
