import { agent } from "@llamaindex/workflow";
import { systemPrompt } from "../config/llm-config.js";
import { initializeLLM } from "../utils/llm.js";
import { webSearchTool } from "../tools/webSearchTool.js";
import { webGetTool } from "../tools/webGetTool.js";
// import { generateWithOllama } from "../utils/ollama.js";
import HoleRepository from "../repositories/hole-repository.js";

// Estado en memoria compartido por el módulo

const llm = await initializeLLM();
const holeAgent = agent({
  llm,
  verbose: true,
  systemPrompt,
  tools: [webSearchTool, webGetTool]
});
export const holes = [];
let nextLocalId = 1;

const repo = new HoleRepository();

export async function createHoleAsync(sessionID) {
  let hole;
  try {
    // Si la base devuelve el objeto, usalo; si solo confirma, crealo localmente
    const dbHole = await repo.createHoleAsync(sessionID);
    hole = dbHole || { id: nextLocalId++, messages: [] };
  } catch (e) {
    hole = { id: nextLocalId++, messages: [] };
    holes.push(hole);
    console.error("Error al persistir el hole:", e?.message || e);
  }
  return hole;
}

export async function getHoleAsync(sessionId, id) {
  const localId = parseInt(id, 10);
  let hole;

  if (!isNaN(localId))
    hole = holes.find((h) => h.id === localId) || null;
  else
    hole = await repo.getHoleAsync(id);

  return hole;
}

export async function sendMessageAsync(id, message) {
  const hole = await getHoleAsync(id);
  if (!hole) return null;

  console.log("🔹 Generando respuesta con LlamaIndex agent para:", message);
  try {
    // Agregamos el mensaje del usuario al historial
    hole.messages.push({ role: "user", content: message });

    // Usamos el agent para generar la respuesta
    const history = hole.messages.map(m => ({ role: m.role, content: m.content }));
  const agentResponse = await holeAgent.run({ messages: history });
    const botMessage = agentResponse?.message ?? "Sin respuesta";

    // Guardamos la respuesta del bot en el historial
    hole.messages.push({ role: "bot", content: botMessage });
    console.log("✅ Respuesta generada:", botMessage);

    // Persistimos ambos mensajes en la base de datos
    let dbOk = true;
    try {
      await repo.addMessageAsync(id, { role: "user", content: message });
      await repo.addMessageAsync(id, { role: "bot", content: botMessage });
      await repo.updateMessagesAsync(hole.id, hole.messages);
    } catch (e) {
      dbOk = false;
      console.error("Error al persistir la conversación en la base:", e?.message || e);
    }

    // Si la persistencia falla, guardamos localmente
    if (!dbOk) {
      if (!holes.find(h => h.id === hole.id)) {
        holes.push(hole);
        console.warn("Guardando copia local de la conversación:", hole.id);
      }
    }

    return { message: botMessage };
  } catch (err) {
    console.error("❌ Error generando respuesta con LlamaIndex agent:", err);
    const botMessage = "❌ Error al generar respuesta";
    hole.messages.push({ role: "bot", content: botMessage });
    return { message: botMessage };
  }
}

export async function getCategoriesAsync() {
  return await repo.getCategoriesAsync();
}
