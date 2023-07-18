import { Router } from "express";
import { cookieExtractor, decodeJwtToken } from "../utils.js";
export class BaseRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  init() {}
  getRouter() {
    return this.router;
  }
  get(path, ...callbacks) {
    this.router.get(path, this.applyCallBacks(callbacks));
  }
  post(path, ...callbacks) {
    this.router.post(path, this.applyCallBacks(callbacks));
  }
  put(path, ...callbacks) {
    this.router.put(path, this.applyCallBacks(callbacks));
  }
  delete(path, ...callbacks) {
    this.router.delete(path, this.applyCallBacks(callbacks));
  }
  handlePolicies(policies) {
    return (req, res, next) => {
      if (policies.includes("PUBLIC")) {
        const user = this.getCurrentUser(req);
        if (user) {
          req.user = user;
          return res.redirect("/products");
        }
        return next();
      }
      if (policies.includes("AUTHENTICATED")) {
        const user = this.getCurrentUser(req);
        if (!user) {
          return res.redirect("/");
        }
        req.user = user;
        return next();
      }
      if (policies.includes("ADMIN")) {
        const user = this.getCurrentUser(req);
        if (!user || user.role.toUpperCase() != "ADMIN") {
          return res.redirect("/");
        }
        req.user = user;
        return next();
      }
      if (policies.includes("USER")) {
        const user = this.getCurrentUser(req);
        console.log(user);
        if (!user || user.role.toUpperCase() != "USER") {
          return res.redirect("/");
        }
        req.user = user;
        return next();
      }
      next();
    };
  }
  getCurrentUser(req) {
    const token = cookieExtractor(req);
    const user = decodeJwtToken(token, "jwtKey");
    return user;
  }
  applyCallBacks(callbacks) {
    return callbacks.map((callbacks) => async (...params) => {
      try {
        await callbacks.apply(this, params);
      } catch (error) {
        console.log(error);
        req, res, next;
        params[1].status(500).send(error);
      }
    });
  }
}
