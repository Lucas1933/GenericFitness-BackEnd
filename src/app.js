import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "../src/routes/productsRouter.js";
import __dirname from "./utils.js";
const app = express();
const port = 8080;
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/api/products", productsRouter);
app.get("/", (req, res) => {
  const user = {
    name: "jose",
  };
  res.render("home", {
    name: user.name,
  });
});
app.listen(port, () => {
  console.log(`server running and listening in port ${port}`);
});
