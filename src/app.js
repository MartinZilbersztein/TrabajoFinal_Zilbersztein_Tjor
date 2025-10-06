import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import indexController from "./controllers/index-controller.js";
import userController from "./controllers/user-controller.js";
import holeController from "./controllers/hole-controller.js";
import sessionMiddleware from "./middlewares/session-middleware.js";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexController);
app.use("/users", userController);
app.use("/holes", sessionMiddleware, holeController);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
