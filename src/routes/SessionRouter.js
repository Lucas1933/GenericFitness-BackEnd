import SessionController from "../controller/sessionController.js";
import { BaseRouter } from "./baseRouter.js";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
const sessionController = new SessionController();
export default class SessionRouter extends BaseRouter {
  init() {
    this.post(
      "/login",
      this.handlePolicies(["PUBLIC"]),
      passport.authenticate("login", {
        session: false,
      }),
      sessionController.logUser
    );
    this.post(
      "/register",
      this.handlePolicies(["PUBLIC"]),
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
      passport.authenticate("github", { session: false }),
      sessionController.temporalMethodLoginGit
    );
    this.delete("/logout", sessionController.logOutUser);
  }
}