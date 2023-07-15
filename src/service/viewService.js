export default class ViewService {
  constructor(repository) {
    this.repository = repository;
  }
  getCart(id) {}
  async getProducts(queryLimit, queryPage, querySort) {
    const products = await this.repository.getProducts(
      queryLimit,
      queryPage,
      querySort
    );

    return products;
  }
}
