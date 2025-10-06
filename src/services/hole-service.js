import { agent, agentStreamEvent } from "@llamaindex/workflow";
import { systemPrompt } from "../config/llm-config.js";
import { initializeLLM } from "../utils/llm.js";
import * as holeRepository from "../repositories/hole-repository.js";

const llm = await initializeLLM();

const holeAgent = agent({
  llm,
  verbose: true,
  systemPrompt,
});
const streams = new Map();
const accumulatedDeltas = new Map();

export const createHoleAsync = async (sessionId, categoryId) => {
  return holeRepository.createHoleAsync(sessionId, categoryId);
};

export const getHoleAsync = async (sessionId, id) => {
  return holeRepository.getHoleAsync(sessionId, id);
};

export const generateAsync = async (sessionId, id, message) => {
  const hole = await getHoleAsync(sessionId, id);

  if (hole === null) return null;

  if (!accumulatedDeltas.has(id)) {
    accumulatedDeltas.set(id, "");
    const stream = runAgentAsync(message, hole.messages);
    processInferedTextAsync(id, stream);
  }

  return [accumulatedDeltas.get(id) ?? null, streams.get(id)];
};

const runAgentAsync = async (message, messages) => {
  const stream = holeAgent.runStream(message, {
    chatHistory: [{ role: "system", content: systemPrompt }, ...messages],
  });
  return stream;
};

const processInferedTextAsync = async (id, stream) => {
  streams.set(id, stream);

  for await (const chunk of stream) {
    if (agentStreamEvent.include(chunk)) {
      accumulatedDeltas.set(id, accumulatedDeltas.get(id) + chunk.delta);
    }
  }

  await updateMessagesAsync(id);
  accumulatedDeltas.delete(id);
  streams.delete(id);
};

const updateMessagesAsync = async (id) => {
  const newMessages = [
    ...hole.messages,
    { role: "user", content: message },
    { role: "assistant", content: accumulatedDeltas.get(id) },
  ];
  holeRepository.updateMessagesAsync(id, newMessages);
};

export const getCategoriesAsync = async () => {
  return holeRepository.getCategoriesAsync();
};
