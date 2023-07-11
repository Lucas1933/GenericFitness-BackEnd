import passport from "passport";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user && info.toString().includes("No auth token")) {
        return res.redirect("/");
      }
      req.user = user;

      next();
    })(req, res, next);
  };
};
