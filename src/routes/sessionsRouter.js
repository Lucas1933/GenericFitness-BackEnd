import { Router } from "express";
import passport from "passport";
const sessionsRouter = Router();

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
  }),
  (req, res) => {
    try {
      req.session.user = {
        name: req.user.firstName,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email,
      };
      res.status(200).send({
        status: "sucess",
        message: "user validated correctly",
        redirection: "/products",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
sessionsRouter.get("/loginFail", (req, res) => {
  res
    .status(401)
    .send({ status: "error", error: "Correo u contraseña incorrectos" });
});

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerFail",
  }),
  async (req, res) => {
    req.session.user = {
      name: req.user.firstName,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    res.status(201).send({
      status: "sucess",
      message: "user registered correctly",
      redirection: "/",
    });
  }
);
sessionsRouter.get(
  "/githubcallbackAuth",
  passport.authenticate("github"),
  (req, res) => {}
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github"),
  (req, res) => {
    req.session.user = {
      name: req.user.firstName,
      role: req.user.role,
      id: req.user.id,
      email: req.user.email,
    };
    res.status(200).redirect("/");
  }
);
sessionsRouter.get("/registerFail", (req, res) => {
  res
    .status(400)
    .send({ status: "error", error: "El correo ya se encuenta registrado" });
});

sessionsRouter.get("/check-session", (req, res) => {
  const sessionId = req.sessionID;
  req.sessionStore.get(sessionId, (error, session) => {
    if (error) {
      console.error(error);
      res.status(500).send({ isSessionExpired: "Error checking session" });
    } else if (!session) {
      res.status(200).send({ isSessionExpired: true });
    } else {
      res.status(200).send({ isSessionExpired: false });
    }
  });
});
sessionsRouter.delete("/user-session", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Session deleted" });
  });
});

export default sessionsRouter;
