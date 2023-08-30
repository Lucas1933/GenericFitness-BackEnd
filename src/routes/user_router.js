import UserController from "../controller/user_controller.js";
import { BaseRouter } from "./base_router.js";
import passport from "passport";
import { passportCall } from "../middlewares/passport_call.js";
import {
  validateUserRegisterFields,
  validateUserLoginFields,
} from "../middlewares/validate_user_fields.js";
const userController = new UserController();
export default class UserRouter extends BaseRouter {
  init() {
    this.post(
      "/login",
      this.handlePolicies(["NO_AUTH"]),
      validateUserLoginFields /* por el funcionamiento de passport fue necesario verificar que no vinieran vacios el email y la password */,
      passportCall("login"),
      userController.logUser
    );
    this.post(
      "/register",
      this.handlePolicies(["NO_AUTH"]),
      validateUserRegisterFields /* por el funcionamiento de passport fue necesario verificar que no vinieran vacios el email y la password */,
      passportCall("register"),
      userController.registerUser
    );
    this.get(
      "/githubcallbackAuth",
      passport.authenticate("github"),
      (req, res) => {}
    );
    this.get(
      "/githubcallback",
      passportCall("github"),
      userController.githubLogin
    );
    this.post(
      "/restorepassword",
      this.handlePolicies(["NO_AUTH"]),
      userController.restoreUserPassword
    );
    this.put(
      "/premium/:userId",
      this.handlePolicies(["ADMIN"]),
      userController.changeUserRole
    );
    this.post("/createpassword", userController.createNewPassword);
    this.post("/verifytoken", userController.verifyToken);
    this.delete("/logout", userController.logOutUser);
  }
}
