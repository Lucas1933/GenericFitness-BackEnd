import { Router } from "express";
import { cookieExtractor, decodeJwtToken } from "../utils/utils.js";
import { FORBIDDEN } from "../utils/httpReponses.js";
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
    try {
      return (req, res, next) => {
        /* declaro un diccionario que tiene como key los endpoints y como value un objeto que como
propiedades tiene los roles permitidos por ese endpoint y como valor de esos roles tenemos 
un array con los http metodos permitidos para ese role */
        const policiesDictionary = {
          "/": { NO_AUTH: ["GET"] },
          "/register": { NO_AUTH: ["GET"] },
          "/restore": { NO_AUTH: ["GET"] },
          "/products": {
            ADMIN: ["GET"],
            PREMIUM: ["GET"],
            USER: ["GET"],
          },
          "/api/users/login": { NO_AUTH: ["POST"] },
          "/api/products": {
            ADMIN: ["GET", "PUT", "POST", "DELETE"],
            PREMIUM: ["POST"],
          },
        };
        /* Obtengo el user del jwt */
        const user = this.getCurrentUser(req);
        const userRole = user ? user.role.toUpperCase() : "NO_AUTH";
        const requestedHttpMethod = req.method;
        /* si hay params, con la regexp los removemos para que matcheen la logica de la politica de acceso, caso contrario la url queda original */
        const requestedEndPoint =
          Object.keys(req.params).length > 0
            ? req.originalUrl.replace(/\/[^/]*$/, "")
            : req.originalUrl;
        console.log(requestedEndPoint);
        /* obtengo el objeto con los roles permitidos para el endpoint requesteado */
        const rolesPermissions = policiesDictionary[requestedEndPoint];

        /* si el rol del usuario matchea con alguno de los rolesPermissions 
        preguntar si el metodo requestado matchea  con los incluidos en el array  de ese rol.
        */
        if (rolesPermissions.hasOwnProperty(userRole)) {
          const allowedHttpMethods = rolesPermissions[userRole];
          if (!allowedHttpMethods.includes(requestedHttpMethod)) {
            /* si el metodo requesteado no se incluye en el array, lanzamos un error indicandolo */
            return res.status(FORBIDDEN).send({
              status: FORBIDDEN,
              message: "Not authorized to request this method",
            });
          } else {
            req.user = user;
            return next();
          }
        } else {
          /* si el rol no se encontro en los permitidos del endpoint entonces lanzamos el error pero diciendo que no tiene acceso al endpoint */
          return res.status(FORBIDDEN).send({
            status: FORBIDDEN,
            message: "Not authorized to access this endpoint",
          });
        }
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
