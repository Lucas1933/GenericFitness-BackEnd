import SessionController from "../controller/sessionController.js";
import { BaseRouter } from "./baseRouter.js";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
import {
  validateUserRegisterFields,
  validateUserLoginFields,
} from "../middlewares/validateUserFields.js";
const sessionController = new SessionController();
export default class SessionRouter extends BaseRouter {
  init() {
    this.post(
      "/login",
      this.handlePolicies(["PUBLIC"]),
      validateUserLoginFields,
      passportCall("login"),
      sessionController.logUser
    );
    this.post(
      "/register",
      this.handlePolicies(["PUBLIC"]),
      validateUserRegisterFields,
      passportCall("register"),
      sessionController.registerUser
    );
    this.get(
      "/githubcallbackAuth",
      passport.authenticate("github"),
      (req, res) => {}
    );
    this.get(
      "/githubcallback",
      passportCall("github"),
      sessionController.githubLogin
    );
    this.delete("/logout", sessionController.logOutUser);
  }
}
