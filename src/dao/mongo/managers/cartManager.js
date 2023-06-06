import cartModel from "../models/cartModel.js";
export default class CartManager {
  createCart() {
    return cartModel.create(undefined);
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

    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }

  getCart(id) {
    return cartModel.findById(id).lean().populate("products.product").lean();
  }
  deleteCart(id) {
    if (!id) return cartModel.deleteMany();

    return cartModel.findByIdAndDelete(id);
  }
  /* for testing purposes */
  getAllCarts() {
    return cartModel.find().lean();
  }
  async deleteProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      (eachProduct) => eachProduct.product == productId
    );
    cart.products.splice(productIndex, 1);
    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }
  async emptyCart(cartId) {
    const cart = await cartModel.findById(cartId).lean();
    cart.products.splice(0);
    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }
  async fillCart(cartId, products) {
    const cart = await cartModel.findById(cartId).lean();
    cart.products = products;
    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }
  async updateProduct(cartId, productId, newQuantity) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      (eachProduct) => eachProduct.product == productId
    );
    if (productIndex != -1) {
      cart.products[productIndex].quantity = newQuantity;
    }
    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }
}
