import { BaseRouter } from "./BaseRouter.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import __dirname from "../utils.js";
import { passportCall } from "../middlewares/passportCall.js";
import { urlAcces } from "../middlewares/urlAcces.js";
export class ViewRouter extends BaseRouter {
  productManager = new ProductManager();
  cartManager = new CartManager();
  init() {
    this.get("/", this.handlePolicies(["PUBLIC"]), (req, res) => {
      res.render("login");
    });
    this.get("/register", this.handlePolicies(["PUBLIC"]), (req, res) => {
      res.render("register");
    });
    this.get(
      "/products",
      this.handlePolicies(["AUTHENTICATED"]),
      (req, res) => {
        this.renderProducts(req, res);
      }
    );
    this.get("/chat", (req, res) => {
      res.render("ecommerceChat");
    });
    this.get("/carts/:cartId", async (req, res) => {
      const cart = await cm.getCart(req.params.cartId);
      res.render("carts", { products: cart.products, id: req.params.cartId });
    });

    this.get("/realtimeproducts", (req, res) => {
      const products = pm.getProducts();
      res.render("realTimeProducts", { products: products });
    });
    this.get("/chat", (req, res) => {
      res.render("ecommerceChat");
    });
  }
  async renderProducts(req, res) {
    const queryLimit = req.query.limit || 10;
    const queryPage = req.query.page || 1;
    const querySort =
      req.query.sort == "asc" ? 1 : req.query.sort == "desc" ? -1 : 0;

    const {
      docs,
      totalDocs,
      offset,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await this.productManager.getProducts(queryLimit, queryPage, querySort);
    const prevLink = `/products?limit=${queryLimit}&page=${prevPage}&sort=${req.query.sort}`;
    const nextLink = `/products?limit=${queryLimit}&page=${nextPage}&sort=${req.query.sort}`;

    res.render("products", {
      products: docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
      userName: req.user.name,
      userRole: req.user.role,
    });
  }
}
