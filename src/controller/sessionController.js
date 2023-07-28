import { sessionService } from "../service/index.js";
import { CREATED, OK } from "../utils/httpReponses.js";

export default class SessionController {
  constructor() {}

  logUser(req, res) {
    try {
      sessionService.generateTokenAndCookie(req.user, res);
      res.status(OK).send({
        status: "sucess",
        message: "user validated correctly",
        redirect: "/products",
      });
    } catch (error) {
      console.log(error);
    }
  }
  registerUser(req, res) {
    sessionService.generateTokenAndCookie(req.user, res);
    res.status(CREATED).send({
      status: "created",
      message: "user registered correctly",
      redirection: "/products",
    });
  }
  githubLogin(req, res) {
    sessionService.generateTokenAndCookie(req.user, res);
    res.redirect("/products");
  }
  logOutUser(req, res) {
    res.clearCookie("token");
    res.status(OK).send({ message: "Logout successful" });
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
