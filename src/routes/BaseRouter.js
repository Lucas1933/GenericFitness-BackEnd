import { Router } from "express";
import { cookieExtractor, decodeJwtToken } from "../utils/utils.js";
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
    try {
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

          if (!user || user.role.toUpperCase() != "USER") {
            return res.redirect("/");
          }
          req.user = user;
          return next();
        }

        next();
      };
    } catch (error) {
      return next(error);
    }
  }
  getCurrentUser(req) {
    try {
      const token = cookieExtractor(req);
      if (!token) {
        return null;
      }
      const user = decodeJwtToken(token, process.env.JWT_KEY);
      return user;
    } catch (error) {
      return null;
    }
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
