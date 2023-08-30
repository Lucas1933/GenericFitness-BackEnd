import { Router } from "express";
import { cookieExtractor, decodeJwtToken } from "../utils/utils.js";

import { ForbiddenUserError } from "../service/error/user_error.js";
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
  /* ADMIN,PREMIUM,USER,NO_AUTH,*/
  handlePolicies(allowedPolicies) {
    return (req, res, next) => {
      try {
        /* Obtengo el user del jwt */
        const user = this.getCurrentUser(req);
        const userRole = user ? user.role.toUpperCase() : "NO_AUTH";
        if (!allowedPolicies.includes(userRole)) {
          throw new ForbiddenUserError("Access to this resource is forbidden.");
        } else {
          req.user = user;
          return next();
        }
      } catch (error) {
        return next(error);
      }
    };
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
