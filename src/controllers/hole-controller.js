import { Router } from "express";
import HoleService from "../services/hole-service.js";

const router = Router();
const holeService = new HoleService();

router.post("/", async (req, res) => {
  const sessionId = req.sessionId;
  const { categoryId } = req.body;

  const hole = await holeService.createHole(sessionId, categoryId);
  res.json(hole);
});

router.get("/:id", async (req, res) => {
  const sessionId = req.sessionId;
  const { id } = req.params;

  const hole = await holeService.getHoleAsync(sessionId, id);
  res.json(hole);
});

router.post("/generate/:id", async (req, res) => {
  const sessionId = req.sessionId;
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).send("El mensaje no puede estar vacío");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const [accumulatedDelta, stream] = holeService.generateAsync(
      sessionId,
      id,
      message,
    );

    res.write(`data: ${accumulatedDelta}\n\n`);

    for await (const chunk of stream) res.write(`data: ${chunk}\n\n`);
  } catch (error) {
    console.error("Error al generar el agujero:", error);
    res.status(500).send("Error al generar el agujero");
  } finally {
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

router.get("/categories", async (req, res) => {
  const categories = await holeService.getCategoriesAsync();
  res.json(categories);
});

export default router;
