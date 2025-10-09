import HoleService from "../services/hole-service.js";

const holeService = new HoleService();

export const sendMessage = async (req, res) => {
  try {
    const { message, categoryId } = req.body;

    if (!message) return res.status(400).json({ error: "Falta message" });

    // Crear hole automáticamente si no existe
    let hole = holeService.holes[0]; // asumimos un solo hole
    if (!hole) {
      if (!categoryId) return res.status(400).json({ error: "Falta categoryId" });
      hole = await holeService.createHoleAsync(categoryId);
      console.log("✅ Hole creado automáticamente:", hole);
    }

    // Enviar mensaje y obtener respuesta
    const response = await holeService.sendMessageAsync(hole.id, message);
    return res.json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
