import fs from "fs";
export default class CartManager {
  carts;
  constructor(path) {
    this.path = path;
    this.#setCarts();
  }
  #setCarts() {
    if (fs.existsSync(this.path)) {
      this.carts = this.#getCarts();
    } else {
      this.carts = [];
      this.#saveCarts();
    }
  }
  #getCarts() {
    const parsedCarts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return parsedCarts;
  }
  #saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }
  createCart() {
    const cart = new Cart();
    if (this.carts.length === 0) {
      cart.id = 1;
    } else {
      cart.id = this.carts.length + 1;
    }
    this.carts.push(cart);
    this.#saveCarts();
  }
  getCart(id) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error(`the id provided must be an integer number`);
      }
      const cart = this.carts.find((eachCart) => eachCart.id === parsedId);
      if (!cart) {
        throw new Error(`the requested cart with id ${id} does not exists`);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }
  addProduct(cartId, productId) {
    try {
      const parsedCartId = parseInt(cartId);
      const parsedProductId = parseInt(productId);
      if (isNaN(parsedCartId)) {
        throw new Error(`the cart id provided must be an integer number`);
      }
      if (isNaN(parsedProductId)) {
        throw new Error(`the product id provided must be an integer number`);
      }
      const cart = this.getCart(parsedCartId);
      if (cart.products.length == 0) {
        cart.products.push({ id: parsedProductId, quantity: 1 });
      } else {
        let product = cart.products.find(
          (eachProduct) => eachProduct.id === parsedProductId
        );
        if (product) {
          product.quantity++;
        } else {
          cart.products.push({ id: parsedProductId, quantity: 1 });
        }
      }
      this.#saveCarts();
    } catch (error) {
      throw error;
    }
  }
}

class Cart {
  constructor() {
    this.products = [];
    this.id = 0;
  }
}
