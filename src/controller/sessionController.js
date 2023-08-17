import { sessionService, cartService } from "../service/index.js";
import { CREATED, OK } from "../utils/httpReponses.js";

export default class SessionController {
  constructor() {}

  logUser(req, res, next) {
    try {
      sessionService.generateTokenAndCookie(req.user, res);
      res.status(OK).send({
        status: OK,
        message: "user validated correctly",
        redirect: "/products",
      });
    } catch (error) {
      next(error);
    }
  }
  async registerUser(req, res, next) {
    try {
      const user = req.user;
      const createdCart = await cartService.createCart();
      user.cart = createdCart._id;
      const insertedUser = await sessionService.createUser(user);
      sessionService.generateTokenAndCookie(insertedUser, res);
      res.status(CREATED).send({
        status: CREATED,
        message: "user registered correctly",
        redirection: "/products",
      });
    } catch (error) {
      next(error);
    }
  }
  githubLogin(req, res) {
    sessionService.generateTokenAndCookie(req.user, res);
    res.redirect("/products");
  }
  logOutUser(req, res, next) {
    try {
      res.clearCookie("token");
      res.status(OK).send({ status: OK, message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }
  async restoreUserPassword(req, res, next) {
    try {
      const email = req.body.email;
      await sessionService.restoreUserPassword(email);
      res.status(OK).send({
        status: OK,
        message: "Password restoration email successfully sended",
      });
    } catch (error) {
      next(error);
    }
  }
}
