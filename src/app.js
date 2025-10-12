import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCategories, createHole, getHole, sendMessage } from "./controllers/hole-controller.js";

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

app.options('/', cors(corsOptions)); // Enable preflight for all routes

// Rutas
app.get("/categories",    getCategories);
app.post("/holes",        createHole);
app.get("/holes/:holeID", getHole);
app.post("/holes/send",   sendMessage);

// Servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
