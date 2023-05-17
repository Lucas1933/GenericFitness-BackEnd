import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
export default class CartManager {
  createCart() {
    return cartModel.create({ products: [] });
  }
  async addProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId).lean();
    const productIndex = cart.products.findIndex(
      (eachProduct) => eachProduct.id === productId
    );
    if (productIndex == -1) {
      cart.products.push({ id: productId, quantity: 1 });
    } else {
      const quantity = cart.products[productIndex].quantity + 1;
      cart.products[productIndex] = { id: productId, quantity: quantity };
    }

    return await cartModel.findByIdAndUpdate(cartId, { $set: cart });
  }

  getCart(id) {
    return cartModel.findById(id).lean();
  }

  /* for testing purposes */
  getAllCarts() {
    return cartModel.find().lean();
  }
}
