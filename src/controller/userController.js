import { userService, cartService } from "../service/index.js";
import { BAD_REQUEST, CREATED, OK } from "../utils/httpReponses.js";

export default class UserController {
  constructor() {}

  logUser(req, res, next) {
    try {
      userService.generateTokenAndCookie(req.user, res);
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
      const insertedUser = await userService.createUser(user);
      userService.generateTokenAndCookie(insertedUser, res);
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
    userService.generateTokenAndCookie(req.user, res);
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

  async changeUserRole(req, res, next) {
    try {
      const id = req.params.userId;
      await userService.changeUserRole(id);
      res
        .status(OK)
        .send({ status: OK, message: "user role updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  async restoreUserPassword(req, res, next) {
    try {
      const email = req.body.email;
      await userService.restoreUserPassword(email);
      res.status(OK).send({
        status: OK,
        message: "Password restoration email successfully sended",
      });
    } catch (error) {
      next(error);
    }
  }
  async createNewPassword(req, res, next) {
    try {
      const token = req.body.token;
      const passwords = req.body.passwords;
      if (passwords.password !== passwords.repeatPassword) {
        return res.status(BAD_REQUEST).send("Passwords do not match");
      }
      await userService.createNewUserPassword(token, passwords.password);
      res
        .status(OK)
        .send({ status: OK, message: "password restored successfully" });
    } catch (error) {
      next(error);
    }
  }
  verifyToken(req, res, next) {
    try {
      const token = req.body.token;
      userService.verifyToken(token);
      res.status(OK).send({ status: OK, message: "token is valid" });
    } catch (error) {
      next(error);
    }
  }
}
