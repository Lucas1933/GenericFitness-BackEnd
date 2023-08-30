import { INTERNAL_SERVER_ERROR } from "../utils/http_responses.js";
import {
  ExistentProductCodeError,
  InvalidProductFieldError,
  InvalidProductIdError,
  NonExistentProductError,
} from "../service/error/product_error.js";
import {
  InvalidUserFieldError,
  ExistentUserEmailError,
  NotRegisteredUserEmailError,
  AlreadyUsedPasswordError,
  InvalidUserIdError,
  ForbiddenUserError,
} from "../service/error/user_error.js";
import {
  InvalidCartIdError,
  NonExistentCartError,
  InvalidCartProductQuantityError,
} from "../service/error/cart_error.js";
import { ExpiredTokenError } from "../service/error/token_error.js";
/* Mapeo la instancia del error (key) con su respectivo metodo getError (value) encargado de construir 
  la respuesta
*/
const errorHandlersMap = new Map([
  /* products related errors */
  [ExistentProductCodeError, ExistentProductCodeError.prototype.getError],
  [InvalidProductFieldError, InvalidProductFieldError.prototype.getError],
  [InvalidProductIdError, InvalidProductIdError.prototype.getError],
  [NonExistentProductError, NonExistentProductError.prototype.getError],
  /* users related errors */
  [InvalidUserFieldError, InvalidUserFieldError.prototype.getError],
  [ExistentUserEmailError, ExistentUserEmailError.prototype.getError],
  [NotRegisteredUserEmailError, NotRegisteredUserEmailError.prototype.getError],
  [InvalidUserIdError, InvalidUserIdError.prototype.getError],
  [AlreadyUsedPasswordError, AlreadyUsedPasswordError.prototype.getError],
  [ForbiddenUserError, ForbiddenUserError.prototype.getError],
  /* carts related errors */
  [InvalidCartIdError, InvalidCartIdError.prototype.getError],
  [NonExistentCartError, NonExistentCartError.prototype.getError],
  [
    InvalidCartProductQuantityError,
    InvalidCartProductQuantityError.prototype.getError,
  ],
  /* token related errors */
  [ExpiredTokenError, ExpiredTokenError.prototype.getError],
]);
export default function errorHandler(err, req, res, next) {
  /* Obtengo el metodo mapeado con la instancia del error que llega al middleware*/
  const errorHandlerFunc = errorHandlersMap.get(err.constructor);
  if (errorHandlerFunc) {
    /* .call() permite utilizar this. lo que nos deja acceder a las propiedades del objeto/error */
    const response = errorHandlerFunc.call(err);
    return res.status(response.status).send(response);
  } else {
    /* si el error no es de ninguna instancia mapeada entonces se defaultea a un status 500 */
    console.log(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
}
