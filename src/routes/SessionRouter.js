import { BaseRouter } from "./BaseRouter.js";
import { generateCookie, generateToken } from "../utils.js";
import { passportCall } from "../middlewares/passportCall.js";
import UserManager from "../dao/mongo/managers/userManager.js";
import passport from "passport";
export class SessionRouter extends BaseRouter {
  userManager = new UserManager();
  init() {
    this.post(
      "/login",
      this.handlePolicies(["PUBLIC"]),
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
    this.post(
      "/register",
      this.handlePolicies(["PUBLIC"]),
      this.isUserRegistered,
      passportCall("register"),
      async (req, res) => {
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
      }
    );
    this.get(
      "/githubcallbackAuth",
      passport.authenticate("github"),
      (req, res) => {}
    );
    this.get(
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
    this.delete("/logout", (req, res) => {
      res.clearCookie("token");
      res.status(200).send({ message: "Logout successful" });
    });
  }

  async isUserRegistered(req, res, next) {
    const email = req.body.email;
    const exists = await this.userManager.checkIfUserExists(email);
    if (exists) {
      return res.status(409).send({ error: "Email already exists" });
    }
    next();
  }
}
