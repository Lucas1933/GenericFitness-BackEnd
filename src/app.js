import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "../src/routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import __dirname from "./utils.js";
const app = express();
const port = 8080;
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.get("/", (req, res) => {
  res.render("home", { name: "miguel", lastName: "gonzalez" });
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); /* static content */
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
  const user = {
    name: "jose",
  };
  res.render("home", {
    name: user.name,
  });
});

const serverExpress = app.listen(port, () => {
  console.log(`server running and listening in port ${port}`);
});
const io = new Server(serverExpress);

const logs = [];
/* listening to events, handshake */
io.on("connection", (socket) => {
  console.log("new client connected");
  //la data aqui es el mensaje
  socket.on("message", (data) => {
    logs.push({ id: socket.id, message: data });
    /* si hago socket.emit se le enia solo a ese socket */
    /*  socket.emit("logs", data); */
    io.emit("logs", logs);
  });
});
