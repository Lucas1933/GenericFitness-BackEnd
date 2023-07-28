import { productService } from "../service/index.js";
import { OK } from "../utils/httpReponses.js";
export default class ProductController {
  async getProducts(req, res) {
    try {
      const queryLimit = req.query.limit || 10;
      const queryPage = req.query.page || 1;
      const querySort =
        req.query.sort == "asc" ? 1 : req.query.sort == "desc" ? -1 : 0;
      const {
        docs,
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = await productService.getPaginatedProducts(
        queryLimit,
        queryPage,
        querySort
      );
      return res.status(200).send({
        status: "200",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "500", error: "internal server error" });
    }
  }

  createProduct(req, res) {
    try {
      const product = req.body;
      productService.addProduct(product);
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async getProductById(req, res) {
    try {
      console.log(req.params.productId);
      const product = await productService.getProductById(req.params.productId);
      return res.status(200).send({ status: "success", payload: product });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "internal server error" });
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.productId,
        req.body
      );

      res.status(200).send({
        message: "Product updated successfully",
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "internal server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productService.deleteProduct(
        req.params.productId
      );
      return res
        .status(200)
        .send({ status: "success", message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "internal server error" });
    }
  }

  mocking(req, res) {
    console.log("mocking");
    const mockedProducts = productService.getMockedProducts();
    res.status(OK).send(mockedProducts);
  }
}
