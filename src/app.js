import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import registerChatHandler from "./listeners/chatHanlder.js";
import passportInit from "./config/passport.js";

import __dirname from "./utils.js";
import { urlAcces } from "./middlewares/urlAcces.js";
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
app.use(cookieParser("cookieKey"));

passportInit();
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.use((err, req, res, next) => {
  return res.status(res.errorCode || 500).send({ error: err.message });
});

io.on("connection", (socket) => {
  console.log("new client", socket.id);
  registerChatHandler(io, socket);
});
app.set("socketio", io);
