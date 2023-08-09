import { INTERNAL_SERVER_ERROR } from "../utils/httpReponses.js";
import {
  ExistentProductCodeError,
  InvalidProductFieldError,
  InvalidProductIdError,
} from "../service/error/ProductError.js";
import {
  InvalidUserFieldError,
  ExistentUserEmailError,
} from "../service/error/UserError.js";
/* Mapeo la instancia del error (key) con su respectivo metodo get (value) encargado de construir 
  la respuesta
*/
const errorHandlersMap = new Map([
  [ExistentProductCodeError, ExistentProductCodeError.prototype.getError],
  [InvalidProductFieldError, InvalidProductFieldError.prototype.getError],
  [InvalidProductIdError, InvalidProductIdError.prototype.getError],
  [InvalidUserFieldError, InvalidUserFieldError.prototype.getError],
  [ExistentUserEmailError, ExistentUserEmailError.prototype.getError],
]);
export default function errorHanlder(err, req, res, next) {
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
