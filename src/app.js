import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sendMessage, getCategories, createHole, getHole } from "./controllers/hole-controller.js";

const app = express();

// Middlewares
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.get("/holes/:holeId", getHole);
app.post("/holes/send", sendMessage);
app.post("/holes", createHole);
app.get("/categories",getCategories);

// Servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
