import { Router } from "express";
import passport from "passport";
import { generateCookie, generateToken } from "../utils.js";
import { passportCall } from "../middlewares/passportCall.js";

const sessionsRouter = Router();

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    session: false,
  }),
  (req, res) => {
    try {
      const user = {
        name: req.user.firstName,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email,
      };
      const token = generateToken(user);
      generateCookie(res, token);
      res.status(200).send({
        status: "sucess",
        message: "user validated correctly",
        redirect: "/products",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
sessionsRouter.get(
  "/githubcallbackAuth",
  passport.authenticate("github"),
  (req, res) => {}
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const user = {
      name: req.user.firstName,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    const token = generateToken(user);
    generateCookie(res, token);
    res.redirect(302, "/products");
  }
);

sessionsRouter.post("/register", passportCall("register"), async (req, res) => {
  const user = {
    name: req.user.firstName,
    role: req.user.role,
    id: req.user.id,
    email: req.user.email,
  };
  const token = generateToken(user);
  generateCookie(res, token);
  res.status(201).send({
    status: "sucess",
    message: "user registered correctly",
    redirection: "/",
  });
});

sessionsRouter.delete("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logout successful" });
});
export default sessionsRouter;
