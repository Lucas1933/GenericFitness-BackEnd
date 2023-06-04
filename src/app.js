import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";

import handlebars from "express-handlebars";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import registerChatHandler from "./listeners/chatHanlder.js";

import __dirname from "./utils.js";
const app = express();
const PORT = process.env.PORT || 8080;
const serverExpress = app.listen(PORT, () => {
  console.log(`server running and listening in port ${PORT}`);
});
const io = new Server(serverExpress);
const connection = mongoose.connect(
  "mongodb+srv://lucas1933:1234@clusterpk.ghi4uir.mongodb.net/GenericFitness?retryWrites=true&w=majority"
);
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`)); /* static content */

app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://lucas1933:1234@clusterpk.ghi4uir.mongodb.net/GenericFitness?retryWrites=true&w=majority",
      ttl: 3600,
    }),
    secret: "signedCookie",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.use((err, req, res, next) => {
  return res.status(res.errorCode || 500).send({ error: err.message });
});

io.on("connection", (socket) => {
  console.log("new client", socket.id);
  registerChatHandler(io, socket);
});
app.set("socketio", io);
