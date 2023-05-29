import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../dao/mongo/managers/productManager.js";

const pm = new ProductManager();
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
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
    return res.status(200).send({
      status: "200",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: "500", error: "internal server error" });
  }
});
productsRouter.post("/", async (req, res) => {
  try {
    const io = req.app.get("socketio");
    const product = req.product;
    await pm.addProduct(product);
    io.emit("updateProducts", await pm.getProducts());
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
productsRouter.get("/:productId", async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.productId);
    return res.status(200).send({ status: "success", payload: product });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});

productsRouter.put("/:productId", (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "Product updated successfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});
productsRouter.delete("/:productId", async (req, res) => {
  try {
    const io = req.app.get("socketio");
    io.emit("updateProducts", await pm.getProducts());

    await pm.deleteProduct(req.params.productId);
    return res
      .status(200)
      .send({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "internal server error" });
  }
});

export default productsRouter;
