import { productService } from "./index.js";
import { InvalidCartIdError, NonExistentCartError } from "./error/CartError.js";
export default class CartService {
  constructor(repository) {
    this.repository = repository;
  }
  async getAllCarts() {
    const carts = await this.repository.getAllCarts();
    return carts;
  }
  async getCartById(id) {
    await this.isIdAndCartValid(id);
    const cart = await this.repository.getCart(id);
    return cart;
  }
  async createCart() {
    try {
      const createdCart = await this.repository.createCart();
      return createdCart;
    } catch (error) {
      throw error;
    }
  }
  async addProduct(cartId, productId) {
    await this.isIdAndCartValid(cartId);
    await productService.isIdAndProductValid(productId);
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
  async getProductsIds(cartId) {
    const products = await this.repository.getProductsIds(cartId);
    return products;
  }
  async getPurchaseAmount(cartId) {
    const cart = await this.getCartById(cartId);
    const products = cart.products;
    let amount = 0;
    for (const product of products) {
      if (product.quantity <= product.product.stock) {
        amount += Number(product.product.price) * Number(product.quantity);
        let newStock = product.product.stock - product.quantity;
        await productService.updateProduct(product.product._id, {
          stock: newStock,
        });
        await this.removeProduct(cartId, product._id);
      }
    }

    return amount;
  }
  async isIdAndCartValid(id) {
    /* se valida que la mongo ID sea valida */
    const isValid = await this.repository.isIdValid(id);
    if (!isValid) {
      throw new InvalidCartIdError(`the cart id ${id} is invalid`);
    }
    const cart = await this.repository.getCartById(id);
    /*si la ID es valida entonces buscamos el producto, pero de no existir lanzamos un error */
    if (!cart) {
      throw new NonExistentCartError(`the cart with id ${id} does not exists`);
    }
  }
}
