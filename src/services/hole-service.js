import { agent } from "@llamaindex/workflow";
import { systemPrompt } from "../config/llm-config.js";
import * as debug from "../utils/debug.js";
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
const repo = new HoleRepository();


export async function getCategoriesAsync() {
  return await repo.getCategoriesAsync();
}

export async function createHoleAsync(sessionID) {
  const entity = await repo.createHoleAsync(sessionID);
  return entity;
}

export async function getHoleAsync(sessionID, holeID) {
  const entity = await repo.getHoleAsync(sessionID, holeID);
  return entity;
}

export async function sendMessageAsync(holeID, message, messages) {
  let assistantMessage;

  debug.log("🔹 Generando respuesta con LlamaIndex agent para:", message);
  try {
    // Usamos el agent para generar la respuesta
    const agentResponse = await holeAgent.run(message, { messages });
    assistantMessage = agentResponse?.data.result || agentResponse?.data.message.content;
    debug.log(agentResponse.data.message);

    // Agregamos el mensaje del usuario al historial
    messages.push({ role: "user", content: message });

    // Guardamos la respuesta del bot en el historial
    messages.push({ role: "assistant", content: assistantMessage });

    // Formateamos la respuesta
    debug.log("✅ Respuesta generada:", assistantMessage);

    debug.log("🔹 Persistiendo conversación en la base...");
    try {
      await repo.updateMessagesAsync(holeID, messages);
      debug.log("✅ Conversación persistida en la base");
    } catch (err) {
      debug.error("Error al persistir la conversación en la base:", err?.message || err);
      throw err;
    }
  } catch (err) {
    debug.error("❌ Error generando respuesta con LlamaIndex agent:", err);
    // const assistantMessage = "❌ Error al generar respuesta";
    messages.push({ role: "assistant", content: "❌ Error al generar respuesta" });
    throw err;
  }

  return { holeID, message: assistantMessage }; // "Sin respuesta"
}
