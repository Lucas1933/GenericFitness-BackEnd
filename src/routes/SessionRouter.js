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
      validateUserLoginFields /* por el funcionamiento de passport fue necesario verificar que no vinieran vacios el email y la password */,
      passportCall("login"),
      sessionController.logUser
    );
    this.post(
      "/register",
      this.handlePolicies(["PUBLIC"]),
      validateUserRegisterFields /* por el funcionamiento de passport fue necesario verificar que no vinieran vacios el email y la password */,
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
    this.post(
      "/restorepassword",
      this.handlePolicies(["PUBLIC"]),
      sessionController.restoreUserPassword
    );
    this.post("/createpassword", sessionController.createNewPassword);
    this.post("/verifytoken", sessionController.verifyToken);
    this.delete("/logout", sessionController.logOutUser);
  }
}
