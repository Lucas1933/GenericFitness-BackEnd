import productModel from "../../dao/mongo/models/productModel.js";
export default class ProductRepository {
  async getPaginatedProducts(queryLimit, queryPage, querySort) {
    const options = {
      limit: queryLimit,
      page: queryPage,
      lean: true,
    };
    querySort != 0 ? (options.sort = { price: querySort }) : null;
    const products = await productModel.paginate({}, options);
    return products;
  }
  async getProducts(filters) {
    const products = await productModel.find();
    return products;
  }
  async getProductById(id) {
    try {
      const product = await productModel.findById(id).lean();
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProduct(product) {
    const createdProduct = await productModel.create(product);
    return createdProduct;
  }
  async updateProduct(id, product) {
    const updatedProduct = await productModel.findByIdAndUpdate(id, {
      $set: product,
    });
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    return deletedProduct;
  }
  async validateCode(code) {
    const exists = await productModel.exists({ code: code });
    return exists ? true : false;
  }
  async validateId(id) {
    const isValid = await productModel.isIdValid(id);
    return isValid;
  }
  async compareIds(id1, id2) {
    const result = await productModel.equals(id1, id2);
    return result;
  }
}
