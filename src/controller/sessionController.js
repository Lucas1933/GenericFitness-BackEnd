import { sessionService } from "../service/index.js";

export default class SessionController {
  constructor() {}

  logUser(req, res) {
    try {
      sessionService.generateTokenAndCookie(req.user, res);
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
    sessionService.generateTokenAndCookie(req.user, res);
    res.status(201).send({
      status: "sucess",
      message: "user registered correctly",
      redirection: "/products",
    });
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
