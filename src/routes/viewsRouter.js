import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productManager.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import __dirname from "../utils.js";

const pm = new ProductManager();
const cm = new CartManager();
const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
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
  } = await pm.getProducts(queryLimit, queryPage, querySort);
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
  });
});

viewsRouter.get("/carts/:cartId", async (req, res) => {
  const cart = await cm.getCart(req.params.cartId);
  res.render("carts", { products: cart.products, id: req.params.cartId });
});
viewsRouter.get("/", (req, res) => {
  const products = pm.getProducts();
  res.render("index", { products: products });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  const products = pm.getProducts();
  res.render("realTimeProducts", { products: products });
});

viewsRouter.get("/chat", (req, res) => {
  res.render("ecommerceChat");
});
export default viewsRouter;
