import { StatusCodes } from "http-status-codes";
import * as debug from "../utils/debug.js";
import getSessionID from "../utils/session.js";
import {
  createHoleAsync,
  getHoleAsync,
  sendMessageAsync as sendHoleMessageAsync,
  getCategoriesAsync as getHoleCategoriesAsync,
} from "../services/hole-service.js";
import { validate as uuidValidate } from "uuid";

export const getCategories = async (req, res) => {
  const categories = await getHoleCategoriesAsync();
  return res.json(categories);
}

export const createHole = async (req, res) => {
  const sessionID = await getSessionID(req, res);
  const hole = await createHoleAsync(sessionID);
  res.json(hole);
}

export const getHole = async (req, res) => {
  const sessionID = await getSessionID(req, res);
  const { holeID } = req.params;
  const hole = await getHoleAsync(sessionID, holeID);

  if (hole)
    return res.json(hole);
  else
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Hole no encontrado" });
}

export const sendMessage = async (req, res) => {
  const sessionID = await getSessionID(req, res);
  const { holeID, input } = req.body;
  let hole = null;

  if (!input)
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Falta message" });

  try {
    if (holeID) {
      if (!uuidValidate(holeID))
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "HoleID no válido" });

      hole = await getHoleAsync(sessionID, holeID);
      if (!hole)
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Hole no encontrado" });
    } else {
      hole = await createHoleAsync(sessionID);
      debug.log("✅ Hole creado automáticamente:", hole);
      holeID = hole.id; // Asegurarse de que holeID esté definido
    }

    const messages = hole.messages || [];

    // Enviar mensaje y obtener respuesta
    // console.log(holeID, message, messages);
    const response = await sendHoleMessageAsync(holeID, input, messages);
    // res.json({holeID, message, messages});
    res.json(response);
  } catch (err) {
    debug.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
