/* declaro un diccionario que tiene como key los endpoints y como value un objeto que como
propiedades tiene los roles permitidos por ese endpoint y como valor de esos roles tenemos 
un array con los http metodos permitidos para ese role */
const policies = {
  "/": { NO_AUTH: ["GET"] },
  "/register": { NO_AUTH: ["GET"] },
  "/restore": { NO_AUTH: ["GET"] },
  "/products": {
    ADMIN: ["GET"],
    PREMIUM: ["GET"],
    USER: ["GET"],
  },
  "/api/users/login": { NO_AUTH: ["POST"] },
  "/api/users/register": { NO_AUTH: ["POST"] },
  "/api/users/verifytoken": { NO_AUTH: ["POST"] },
  "/api/users/restorepassword": { NO_AUTH: ["POST"] },
  "/api/users/createpassword": { NO_AUTH: ["POST"] },
  "/api/users/logout": {
    ADMIN: ["DELETE"],
    PREMIUM: ["DELETE"],
    USER: ["DELETE"],
  },
  "/api/users/premium": { ADMIN: ["PUT"] },
  "/api/products": {
    ADMIN: ["GET", "PUT", "POST", "DELETE"],
    PREMIUM: ["POST"],
  },
};
export default policies;
