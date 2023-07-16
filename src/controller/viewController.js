import { viewService } from "../service/index.js";
export default class ViewController {
  renderLogin(req, res) {
    res.render("login");
  }

  renderRegister(req, res) {
    res.render("register");
  }

  renderChat(req, res) {
    res.render("ecommerceChat");
  }
  renderCart(req, res) {
    const cart = viewService.getCart(req.params.cartId);
    res.render("carts", { products: cart.products, id: req.params.cartId });
  }
  renderRealTimeProducts(req, res) {
    const products = viewService.getProducts();
    res.render("realTimeProducts", { products: products });
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
    } = await viewService.getProducts(queryLimit, queryPage, querySort);
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