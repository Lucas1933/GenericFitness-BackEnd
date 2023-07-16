import CartService from "../service/cartService.js";
import ProductService from "../service/productService.js";
import ViewService from "../service/viewService.js";

import CartRepository from "../service/repositories/cartRepository.js";
import ProductRepository from "../service/repositories/productRepository.js";

export const productService = new ProductService(new ProductRepository());
export const cartService = new CartService(new CartRepository());
export const viewService = new ViewService(new ProductRepository());
