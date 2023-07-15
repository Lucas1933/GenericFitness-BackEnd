import UserRepository from "../service/repositories/userRepository.js";
import SessionService from "../service/sessionService.js";
import { generateCookie, generateToken } from "../utils.js";

export default class SessionController {
  constructor() {
    this.sessionService = new SessionService(new UserRepository());
  }

  logUser(req, res) {
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
  registerUser(req, res) {
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
    console.log(email);
    const exists = this.sessionService.getUser(email);
    if (exists) {
      return res.status(409).send({ error: "Email already exists" });
    }
    next();
  }
}
