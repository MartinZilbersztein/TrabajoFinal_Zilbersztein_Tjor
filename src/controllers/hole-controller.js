import {
  holes,
  createHoleAsync,
  getHoleAsync,
  sendMessageAsync as sendHoleMessageAsync,
  getCategoriesAsync as getHoleCategoriesAsync,
} from "../services/hole-service.js";
import getSessionID from "../utils/session.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, categoryId } = req.body;

    if (!message) return res.status(400).json({ error: "Falta message" });

    // Crear hole automáticamente si no existe
    let hole = holes[0]; // asumimos un solo hole
    if (!hole) {
      if (!categoryId) return res.status(400).json({ error: "Falta categoryId" });
      hole = await createHoleAsync(categoryId);
      console.log("✅ Hole creado automáticamente:", hole);
    }

    // Enviar mensaje y obtener respuesta
    const response = await sendHoleMessageAsync(hole.id, message);
    return res.json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  const categories = await getHoleCategoriesAsync();
  return res.json(categories);
};

export const createHole = async (req, res) =>{
  const sessionID = await getSessionID(req, res);
  const hole = await createHoleAsync(sessionID);
  res.json(hole);
}

export const getHole = async (req, res) => {
  const sessionID = await getSessionID(req, res);
  const { holeId } = req.params;
  const hole = await getHoleAsync(sessionID, holeId);

  if (hole)
    return res.json(hole);
  else
    return res.status(404).json({ error: "Hole no encontrado" });
}