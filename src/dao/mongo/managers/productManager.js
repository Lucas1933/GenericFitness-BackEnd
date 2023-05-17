import productModel from "../models/productModel.js";
export default class ProductManager {
  getProducts() {
    return productModel.find().lean();
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
