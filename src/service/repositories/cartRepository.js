import cartModel from "../../dao/mongo/models/cartModel.js";
import { productService } from "../index.js";
export default class CartRepository {
  async createCart() {
    const createdCart = await cartModel.create(undefined);
    return createdCart;
  }
  async addProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      (eachProduct) => eachProduct.product == productId
    );
    if (productIndex == -1) {
      cart.products.push({ product: productId });
    } else {
      const quantity = cart.products[productIndex].quantity + 1;
      cart.products[productIndex] = { product: productId, quantity: quantity };
    }
    const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
      $set: cart,
    });
    return updatedCart;
  }

  async getCartById(id) {
    const cart = await cartModel
      .findById(id)
      .lean()
      .populate("products.product")
      .lean();
    return cart;
  }
  async deleteCart(id) {
    const deletedCart = await cartModel.findByIdAndDelete(id);
    return deletedCart;
  }
  /* for testing purposes */
  async getAllCarts() {
    const carts = await cartModel.find().lean();
    return carts;
  }
  async deleteProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      async (eachProduct) =>
        await productService.compareProductsIds(eachProduct._id, productId)
    );
    cart.products.splice(productIndex, 1);

    const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
      $set: cart,
    });
    return updatedCart;
  }
  async emptyCart(cartId) {
    const cart = await cartModel.findById(cartId).lean();
    cart.products.splice(0);
    const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
      $set: cart,
    });
    return updatedCart;
  }
  async fillCart(cartId, products) {
    const cart = await cartModel.findById(cartId).lean();
    cart.products = products;
    const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
      $set: cart,
    });
    return updatedCart;
  }
  async updateProduct(cartId, productId, newQuantity) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      (eachProduct) => eachProduct.product == productId
    );
    if (productIndex != -1) {
      cart.products[productIndex].quantity = newQuantity;
    }
    const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
      $set: cart,
    });
    return updatedCart;
  }
  async getProductsIds(cartId) {
    const cart = await cartModel.findById(cartId).lean();
    const products = [];
    cart.products.forEach((eachProduct) =>
      products.push(eachProduct.product._id)
    );
    return products;
  }
  async isIdValid(id) {
    const result = await cartModel.isIdValid(id);
    return result;
  }
}
