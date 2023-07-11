import { BaseRouter } from "./BaseRouter.js";

export class ProductRouter extends BaseRouter {
  init() {
    this.get("/", (req, res) => {
      res.send("hello poo");
    });
  }
}
