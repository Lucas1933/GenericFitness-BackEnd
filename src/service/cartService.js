import { productService } from "./index.js";
import {
  InvalidCartIdError,
  NonExistentCartError,
  InvalidCartProductQuantityError,
} from "./error/CartError.js";
import { InvalidProductIdError } from "./error/ProductError.js";
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
    const cart = await this.repository.getCartById(id);
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
    await this.isIdAndCartValid(id);
    for (const eachProduct of products) {
      this.isQuantityValid(eachProduct);
      await productService.isIdAndProductValid(eachProduct.product);
    }
    const updatedCart = await this.repository.fillCart(id, products);
    return updatedCart;
  }
  async updateProduct(cartId, productId, quantity) {
    await this.isIdAndCartValid(cartId);
    await productService.isIdAndProductValid(productId);
    this.isQuantityValid({ quantity });
    const updatedCart = await this.repository.updateProduct(
      cartId,
      productId,
      quantity
    );
    return updatedCart;
  }
  async deleteCart(id) {
    await this.isIdAndCartValid(id);
    const deletedCart = await this.repository.deleteCart(id);
    return deletedCart;
  }
  async emptyCart(id) {
    await this.isIdAndCartValid(id);
    const emptyCart = await this.repository.emptyCart(id);
    return emptyCart;
  }
  async removeProduct(cartId, productId) {
    await this.isIdAndCartValid(cartId);
    await productService.isIdAndProductValid(productId);
    const cart = await this.repository.getCartById(cartId);
    for (const eachProduct of cart.products) {
      const idsAreEqual = await productService.compareProductsIds(
        productId,
        eachProduct.product._id
      );
      if (idsAreEqual) {
        const updatedCart = await this.repository.deleteProduct(
          cartId,
          productId
        );
        return updatedCart;
      }
    }
    throw new InvalidProductIdError(
      `The product with id ${productId} is invalid or does not exists`
    );
  }
  async getProductsIds(cartId) {
    await this.isIdAndCartValid(cartId);
    const products = await this.repository.getProductsIds(cartId);
    return products;
  }
  async getPurchaseAmount(cartId) {
    await this.isIdAndCartValid(cartId);
    const cart = await this.getCartById(cartId);
    const products = cart.products;
    let amount = 0;
    for (const product of products) {
      if (product.quantity <= product.product.stock) {
        amount += Number(product.product.price) * Number(product.quantity);
        const newStock = product.product.stock - product.quantity;
        product.product.stock = newStock;
        await productService.updateProduct(
          product.product._id,
          product.product
        );
        await this.removeProduct(cartId, product.product._id);
      }
    }
    return amount;
  }
  /* considerar si deberia devolver el carrito */
  async isIdAndCartValid(id) {
    /* se valida que la mongo ID sea valida */
    const isValid = await this.repository.isIdValid(id);
    if (!isValid) {
      throw new InvalidCartIdError(`the cart id ${id} is invalid`);
    }
    const cart = await this.repository.getCartById(id);
    /*si la ID es valida entonces buscamos el cart, pero de no existir lanzamos un error */
    if (!cart) {
      throw new NonExistentCartError(`the cart with id ${id} does not exists`);
    }
  }
  isQuantityValid(product) {
    const quantity = product.quantity;
    if (!Number.isInteger(quantity)) {
      throw new InvalidCartProductQuantityError(
        `the quantity of the product ${product.product} should be an integer number, the value sended is ${quantity}`
      );
    }
  }
}
