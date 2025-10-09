import express from "express";
import cors from "cors";
import { sendMessage } from "./controllers/hole-controller.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.post("/holes/send", sendMessage);

// Servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
