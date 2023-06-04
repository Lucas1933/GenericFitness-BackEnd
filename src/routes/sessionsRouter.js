import { Router } from "express";
import userModel from "../dao/mongo/models/userModel.js";

const sessionsRouter = Router();

sessionsRouter.get("/login/:email/:password", async (req, res) => {
  const userExists = await userModel
    .findOne({ email: req.params.email })
    .lean();
  const isUserValid = userExists
    ? req.params.password === userExists.password
    : false;
  if (isUserValid) {
    req.session.name = userExists.firstName;
  }
  return res.send({
    status: 200,
    message: isUserValid ? "user valid" : "Password or email are invalid",
    payload: { userIsValid: isUserValid },
  });
});
sessionsRouter.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await userModel.create({ firstName, lastName, email, password });
    res.status(200).send({ message: "registration complete" });
  } catch (error) {
    console.log(error);
  }
});

sessionsRouter.get("/userSession", async (req, res) => {
  const sessionId = req.sessionID;
  res.send({ payload: { sessionId: sessionId } });
});

sessionsRouter.delete("/userSession", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Session deleted" });
  });
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
export default sessionsRouter;
