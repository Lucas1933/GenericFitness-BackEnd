import { sessionService } from "../service/index.js";
export function validateUserRegisterFields(req, res, next) {
  try {
    sessionService.validateUserFields(req.body);
    next();
  } catch (error) {
    next(error);
  }
}
export function validateUserLoginFields(req, res, next) {
  try {
    /* no me parece buena practica, buscar refactorizacion */
    req.body.firstName = "dummy value";
    req.body.lastName = "dummy value";
    sessionService.validateUserFields(req.body);
    next();
  } catch (error) {
    next(error);
  }
}
