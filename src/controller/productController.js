import { productService } from "../service/index.js";
import { CREATED, OK } from "../utils/httpReponses.js";
export default class ProductController {
  async getPaginatedProducts(req, res, next) {
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

      return res.status(OK).send({
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
      });
    } catch (error) {
      return next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = req.body;
      const createdProduct = await productService.addProduct(product);
      return res.status(CREATED).send({ payload: createdProduct });
    } catch (error) {
      /* Se envia el error al middleware centralizado de manejo de errores "errorHandler" */
      return next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.productId);
      return res.status(OK).send({ payload: product });
    } catch (error) {
      return next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.productId,
        req.body
      );
      res.status(OK).send({
        message: "Product updated successfully",
        status: OK,
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await productService.deleteProduct(
        req.params.productId
      );
      return res
        .status(OK)
        .send({ status: OK, message: "Product deleted successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
