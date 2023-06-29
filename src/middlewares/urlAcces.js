import { urlPrivilige } from "../utils.js";

export const urlAcces = (req, res, next) => {
  const urlAccess = urlPrivilige(req.url);
  if (urlAccess == "public" && req.user) {
    return res.status(302).redirect("/products");
  }
  if (urlAccess == "private" && !req.user) {
    return res.status(401).redirect("/");
  }
  next();
};
