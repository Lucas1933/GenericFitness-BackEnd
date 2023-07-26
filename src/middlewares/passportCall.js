import passport from "passport";
import { CONFLICT, UNAUTHORIZED } from "../utils/httpReponses.js";
export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user && info.status == UNAUTHORIZED) {
        return res.status(UNAUTHORIZED).send(info);
      }

      if (!user && info.status == CONFLICT) {
        return res.status(CONFLICT).send(info);
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
