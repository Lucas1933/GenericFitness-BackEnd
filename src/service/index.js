import CartService from "./services/cart_service.js";
import ProductService from "./services/product_service.js";
import ViewService from "./services/view_service.js";
import UserService from "./services/user_service.js";
import TicketService from "./services/ticket_service.js";
import EmailService from "./services/email_service.js";

import UserRepository from "./repositories/user_repository.js";
import CartRepository from "./repositories/cart_repository.js";
import ProductRepository from "./repositories/product_repository.js";
import TicketRepository from "./repositories/ticket_repository.js";

export const productService = new ProductService(new ProductRepository());
export const cartService = new CartService(new CartRepository());
export const viewService = new ViewService(new ProductRepository());
export const userService = new UserService(new UserRepository());
export const ticketService = new TicketService(new TicketRepository());
export const emailService = new EmailService();
