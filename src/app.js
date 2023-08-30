import "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import ProductRouter from "./routes/product_router.js";
import UserRouter from "./routes/user_router.js";
import ViewRouter from "./routes/view_router.js";
import CartRouter from "./routes/cart_router.js";
import TestRouter from "./routes/test_router.js";

import passportInit from "./config/passport.js";

import __dirname from "./path.js";
import errorHandler from "./middlewares/error_handler.js";

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
const userRouter = new UserRouter();
const cartRouter = new CartRouter();
const testRouter = new TestRouter();

passportInit();

app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/users", userRouter.getRouter());
app.use("/api/test", testRouter.getRouter());
app.use("/", viewRouter.getRouter());

app.use(errorHandler);
