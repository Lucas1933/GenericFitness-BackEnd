import passport from "passport";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      console.log(err, user, info);
      if (err) {
        return next(err);
      }
      if (!user && info.toString().includes("No auth token")) {
        console.log("redirection");
        return res.redirect("/");
      }
      console.log(info, "info");
      if (!user && info.toString().includes("email already registered")) {
        console.log("if");
        return res
          .status(409)
          .send({ error: "conflict", message: "email already registered" });
      }
      req.user = user;

      next();
    })(req, res, next);
  };
};
