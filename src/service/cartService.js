export default class CartService {
  constructor(repository) {
    this.repository = repository;
  }
  async getAllCarts() {
    const carts = await this.repository.getAllCarts();
    return carts;
  }
  async getCartById(id) {
    const cart = await this.repository.getCart(id);
    return cart;
  }
  async createCart() {
    const createdCart = await this.repository.createCart();
    return createdCart;
  }
  async addProduct(cartId, productId) {
    const updatedCart = await this.repository.addProduct(cartId, productId);
    return updatedCart;
  }
  async fillCart(id, products) {
    const updatedCart = await this.repository.fillCart(id, products);
    return updatedCart;
  }
  async updateProduct(cartId, productId, quantity) {
    const updatedCart = await this.repository.updateProduct(
      cartId,
      productId,
      quantity
    );
    return updatedCart;
  }
  async deleteCart(id) {
    const deletedCart = await this.repository.deleteCart(id);
    return deletedCart;
  }
  async emptyCart(id) {
    const emptyCart = await this.repository.emptyCart(id);
    return emptyCart;
  }
  async removeProduct(cartId, productId) {
    const updatedCart = await this.repository.deleteProduct(cartId, productId);
    return updatedCart;
  }
}
