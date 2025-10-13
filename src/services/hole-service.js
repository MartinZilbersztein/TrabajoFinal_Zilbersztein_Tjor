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

export async function sendMessageAsync(holeID, input, messages) {
  let assistantMessage;

  debug.log("🔹 Generando respuesta con LlamaIndex agent para:", input);
  try {
    // Usamos el agent para generar la respuesta
    const agentResponse = await holeAgent.run(input, { messages });
    assistantMessage = agentResponse?.data.result || agentResponse?.data.message.content;
    debug.log(agentResponse.data.message);

    messages.push({ role: "user", content: input });
    messages.push({ role: "assistant", content: assistantMessage });

    // Formateamos la respuesta
    debug.log("✅ Respuesta generada:", assistantMessage);
  } catch (err) {
    debug.error("❌ Error generando respuesta con LlamaIndex agent:", err);
    // const assistantMessage = "❌ Error al generar respuesta";
    messages.push({ role: "assistant", content: "❌ Error al generar respuesta" });
    throw err;
  }

  debug.log("🔹 Persistiendo conversación en la base...");
  try {
    await repo.updateMessagesAsync(holeID, messages);
    debug.log("✅ Conversación persistida en la base");
  } catch (err) {
    debug.error("Error al persistir la conversación en la base:", err?.message || err);
    throw err;
  }

  return { holeID, message: assistantMessage }; // "Sin respuesta"
}
