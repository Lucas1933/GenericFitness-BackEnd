import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "../src/routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import __dirname from "./utils.js";
const app = express();
const PORT = process.env.PORT || 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`)); /* static content */
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use((err, req, res, next) => {
  return res.status(res.errorCode || 500).send({ error: err.message });
});
const serverExpress = app.listen(PORT, () => {
  console.log(`server running and listening in port ${PORT}`);
});
const io = new Server(serverExpress);
io.on("connection", (socket) => {
  console.log("new client", socket.id);
});
app.set("socketio", io);
/* const logs = []; */
/* listening to events, handshake */
/* io.on("connection", (socket) => {
  console.log("new client connected", socket.id); */
//la data aqui es el mensaje
/*   socket.on("message", (data) => {
    logs.push({ id: socket.id, message: data }); */
/* si hago socket.emit se le enia solo a ese socket */
/*  socket.emit("logs", data); */
/*     io.emit("logs", logs);
  });
}); */
/* por cada emit hay un on, se emite y se recibe(on) dado el primer parametros
que identifica a que metodo de ese socket nos estamos refiriendo
en el caso del io.emit o io.on se recibia o enviara data a todos los sockets*/
