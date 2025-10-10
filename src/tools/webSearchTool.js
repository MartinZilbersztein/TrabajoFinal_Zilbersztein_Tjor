import { tool } from "llamaindex";
import { z } from "zod";
import { duckduckgoSearch } from "../lib/search/duckduckgo.js";

const webSearch = async ({ query, count = 5 }) => {
  if (!query || !query.trim()) throw new Error("query is required");
  const results = await duckduckgoSearch(query, { count });
  return results.map((r) => ({ title: r.title, url: r.url }));
};

export const webSearchTool = tool({
    name: "webSearch",
    description: "Buscar en la web (DuckDuckGo Lite) y devolver títulos y URLs relevantes.",
    parameters: z.object({
      query: z.string().min(1).describe("Consulta a buscar"),
      count: z.number().min(1).max(20).default(5).describe("Cantidad de resultados"),
    }),
    execute: async ({ query, count = 5 }) => {
      return webSearch({ query, count });
    },
});


// Optional: CLI for quick manual testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const q = process.argv.slice(2).join(" ") || "llamaindex duckduckgo lite";
  webSearch({ query: q, count: 5 })
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
