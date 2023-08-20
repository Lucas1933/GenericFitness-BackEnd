import { Router } from "express";
import { cookieExtractor, decodeJwtToken, getBaseUrl } from "../utils/utils.js";
import policies from "../config/policies.js";
import { ForbiddenUserError } from "../service/error/UserError.js";
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
      /* Obtengo el user del jwt */
      const user = this.getCurrentUser(req);
      const userRole = user ? user.role.toUpperCase() : "NO_AUTH";
      const requestedHttpMethod = req.method;
      const numberOfParams = Object.keys(req.params).length;
      /* si hay params, con la regexp los removemos para que matcheen la logica de la politica de acceso, caso contrario la url queda original */
      const requestedEndPoint =
        numberOfParams > 0
          ? getBaseUrl(req.originalUrl, numberOfParams)
          : req.originalUrl;
      /* obtengo el objeto con los roles permitidos para el endpoint requesteado */
      const rolesPermissions = policies[requestedEndPoint];
      console.log(
        "original",
        req.originalUrl,
        "end point",
        requestedEndPoint,
        Object.keys(req.params).length > 0
      );
      try {
        /* si el rol del usuario matchea con alguno de los rolesPermissions 
        preguntar si el metodo requestado matchea  con los incluidos en el array  de ese rol.
        */
        if (rolesPermissions.hasOwnProperty(userRole)) {
          const allowedHttpMethods = rolesPermissions[userRole];
          if (!allowedHttpMethods.includes(requestedHttpMethod)) {
            /* si el metodo requesteado no se incluye en el array, lanzamos un error indicandolo */
            throw new ForbiddenUserError(
              "Not authorized to request this method"
            );
          } else {
            req.user = user;
            return next();
          }
        } else {
          /* si el rol no se encontro en los permitidos del endpoint entonces lanzamos el error pero indicando que no tiene acceso al endpoint */
          throw new ForbiddenUserError(
            "Not authorized to access this endpoint"
          );
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
