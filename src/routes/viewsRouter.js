import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productManager.js";
import __dirname from "../utils.js";

const pm = new ProductManager();
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
