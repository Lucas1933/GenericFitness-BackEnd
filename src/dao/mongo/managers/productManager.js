import productModel from "../models/productModel.js";
export default class ProductManager {
  getProducts(queryLimit, queryPage, querySort) {
    const options = {
      limit: queryLimit,
      page: queryPage,
      lean: true,
    };
    querySort != 0 ? (options.sort = { price: querySort }) : null;
    return productModel.paginate({}, options);
  }

  getProductById(id) {
    try {
      return productModel.findById(id).lean();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  addProduct(product) {
    return productModel.create(product);
  }
  updateProduct(id, product) {
    return productModel.findByIdAndUpdate(id, { $set: product });
  }

  deleteProduct(id) {
    return productModel.findByIdAndDelete(id);
  }
  validateCode(code) {
    return productModel.exists({ code: code });
  }
  validateId(id) {
    return productModel.exists(id);
  }
}
