import { generateWithOllama } from "../utils/ollama.js";

export default class HoleService {
  constructor() {
    this.holes = [];
    this.nextId = 1;
  }

  async createHoleAsync(categoryId) {
    const hole = { id: this.nextId++, categoryId, messages: [] };
    this.holes.push(hole);
    return hole;
  }

  async getHoleAsync(id) {
    return this.holes.find(h => h.id === id) || null;
  }

  async sendMessageAsync(id, message) {
    const hole = await this.getHoleAsync(id);
    if (!hole) return { error: "Hole no encontrado" };

    // 🔹 Guardamos el mensaje del usuario
    hole.messages.push({ role: "user", content: message });
    console.log("🔹 Generando respuesta con Ollama para:", message);

    try {
      // 🔹 Creamos prompt con todo el historial
const prompt = hole.messages
  .map(m => (m.role === "user" ? `Usuario: ${m.content}` : m.content))
  .join("\n");
      const botMessage = await generateWithOllama(prompt);

      // 🔹 Guardamos la respuesta del bot
      hole.messages.push({ role: "bot", content: botMessage });
      console.log("✅ Respuesta generada:", botMessage);

      return { message: botMessage };
    } catch (err) {
      console.error("❌ Error generando respuesta con Ollama:", err);
      const botMessage = "❌ Error al generar respuesta";
      hole.messages.push({ role: "bot", content: botMessage });
      return { message: botMessage };
    }
  }
}
