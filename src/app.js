import "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import ProductRouter from "./routes/productRouter.js";
import SessionRouter from "./routes/sessionRouter.js";
import ViewRouter from "./routes/viewRouter.js";
import CartRouter from "./routes/cartRouter.js";
import TestRouter from "./routes/testRouter.js";

import passportInit from "./config/passport.js";

import __dirname from "./path.js";

const app = express();
const PORT = process.env.PORT || 8080;
const serverExpress = app.listen(PORT, () => {
  console.log(`server running and listening in port ${PORT}`);
});
const connection = mongoose.connect(process.env.DB_LOCAL);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`)); /* static content */
app.use(cookieParser(process.env.COOKIE_KEY));

const productRouter = new ProductRouter();
const viewRouter = new ViewRouter();
const sessionRouter = new SessionRouter();
const cartRouter = new CartRouter();
const testRouter = new TestRouter();

passportInit();

app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/test", testRouter.getRouter());
app.use("/", viewRouter.getRouter());

app.use((err, req, res, next) => {
  return res.status(res.errorCode || 500).send({ error: err.message });
});
