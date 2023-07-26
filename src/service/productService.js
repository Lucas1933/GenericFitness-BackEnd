export default class ProductService {
  constructor(repository) {
    this.repository = repository;
  }
  async getPaginatedProducts(queryLimit, queryPage, querySort) {
    const products = await this.repository.getProducts(
      queryLimit,
      queryPage,
      querySort
    );
    return products;
  }
  async addProduct(product) {
    const createdProduct = this.repository.addProduct(product);
    return createdProduct;
  }
  getProducts() {}
  async getProductById(id) {
    const product = await this.repository.getProductById(id);
    return product;
  }
  async updateProduct(id, product) {
    const updatedProduct = await this.repository.updateProduct(id, product);
    return updatedProduct;
  }
  async compareProductsIds(id1, id2) {
    const result = await this.repository.compareIds(id1, id2);
    return result;
  }
  async deleteProduct(id) {
    const deletedProduct = await this.repository.deleteProduct(id);
    return deletedProduct;
  }
}
