import CartService from "../service/cartService.js";
import ProductService from "../service/productService.js";
import ViewService from "../service/viewService.js";
import SessionService from "../service/sessionService.js";
import TicketService from "./ticketService.js";
import EmailService from "./emailService.js";

import UserRepository from "../service/repositories/userRepository.js";
import CartRepository from "../service/repositories/cartRepository.js";
import ProductRepository from "../service/repositories/productRepository.js";
import TicketRepository from "./repositories/ticketRepository.js";

export const productService = new ProductService(new ProductRepository());
export const cartService = new CartService(new CartRepository());
export const viewService = new ViewService(new ProductRepository());
export const sessionService = new SessionService(new UserRepository());
export const ticketService = new TicketService(new TicketRepository());
export const emailService = new EmailService();
