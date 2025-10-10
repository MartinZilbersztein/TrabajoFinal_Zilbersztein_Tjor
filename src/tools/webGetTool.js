import { tool } from "llamaindex";
import { z } from "zod";

const webGet = async ({ url }) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener la página web: ${response.statusText}`);
  }
  const html = await response.text();
  return html;
};

export const webGetTool = tool({
    name: "webGet",
    description: "Obtener el contenido HTML de una página web dada su URL.",
    parameters: z.object({
      url: z.string().url().describe("URL de la página web a obtener"),
    }),
    execute: async ({ url }) => {
      return webGet({ url });
    },
});

// Optional: CLI for quick manual testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || "https://example.com";
  webGetTool({ url })
    .then((r) => console.log(r))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}