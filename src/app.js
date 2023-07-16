import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import ProductRouter from "./routes/productRouter.js";
import SessionRouter from "./routes/sessionRouter.js";
import ViewRouter from "./routes/viewRouter.js";
import CartRouter from "./routes/cartRouter.js";

import passportInit from "./config/passport.js";

import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const serverExpress = app.listen(PORT, () => {
  console.log(`server running and listening in port ${PORT}`);
});
const connection = mongoose.connect(
  "mongodb://localhost:27017/"
  /* "mongodb+srv://lucas1933:1234@clusterpk.ghi4uir.mongodb.net/GenericFitness?retryWrites=true&w=majority" */
);
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`)); /* static content */
app.use(cookieParser("cookieKey"));

const productRouter = new ProductRouter();
const viewRouter = new ViewRouter();
const sessionRouter = new SessionRouter();
const cartRouter = new CartRouter();

passportInit();

app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/", viewRouter.getRouter());

app.use((err, req, res, next) => {
  return res.status(res.errorCode || 500).send({ error: err.message });
});
