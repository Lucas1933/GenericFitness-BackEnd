import { sessionService, cartService } from "../service/index.js";
import { generateCookie, generateToken } from "../utils.js";

export default class SessionController {
  constructor() {}

  logUser(req, res) {
    try {
      const user = {
        name: req.user.firstName,
        role: req.user.role,
        cart: req.user.cart,
        email: req.user.email,
      };
      console.log(user);
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
  async registerUser(req, res) {
    const user = {
      name: req.user.firstName,
      role: req.user.role,
      cart: req.user.cart,
      email: req.user.email,
    };
    console.log("register user", user);
    const token = generateToken(user);
    generateCookie(res, token);
    res.status(201).send({
      status: "sucess",
      message: "user registered correctly",
      redirection: "/",
    });
  }
  temporalMethodLoginGit(req, res) {
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
  logOutUser(req, res) {
    res.clearCookie("token");
    res.status(200).send({ message: "Logout successful" });
  }
  isUserRegistered(req, res, next) {
    const email = req.body.email;
    const exists = sessionService.getUser(email);
    if (exists) {
      return res.status(409).send({ error: "Email already exists" });
    }
    next();
  }
}
