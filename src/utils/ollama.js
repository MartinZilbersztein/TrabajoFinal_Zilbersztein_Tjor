import fetch from "node-fetch";

export const generateWithOllama = async (prompt) => {
  const model = process.env.LLM_MODEL || "gemma3:1b";

  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });

  if (!response.ok) throw new Error("Error al conectar con Ollama: " + response.statusText);

  const data = await response.json();
  return data.response || "Respuesta vacía";
};
