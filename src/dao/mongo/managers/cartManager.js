import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
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
    return cartModel.findById(id).lean();
  }
  deleteCart(id) {
    if (!id) return cartModel.deleteMany();

    return cartModel.findByIdAndDelete(id);
  }
  /* for testing purposes */
  getAllCarts() {
    return cartModel.find().lean();
  }
}
