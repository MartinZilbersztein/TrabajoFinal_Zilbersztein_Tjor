import https from "https";
import axios from "axios";

export async function duckduckgoSearch(query, { count = 5 } = {}) {
  // === MODO DESARROLLO: ignora errores de certificado (NO USAR en producción) ===
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // ⚠️ solo para desarrollo/local
  });

  // === Alternativa segura: usar un certificado CA personalizado ===
  // import fs from "fs";
  // const ca = fs.readFileSync("./certificado.crt");
  // const httpsAgent = new https.Agent({ ca, rejectUnauthorized: true });

  try {
    const u = new URL("https://html.duckduckgo.com/html/");
    u.searchParams.set("q", query);

    const { data: html } = await axios.get(u.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LlamaIndexTool/1.0; +https://rabb-ia.vercel.app/)",
        Accept: "text/html",
      },
      timeout: 10000,
      httpsAgent, // <-- aquí va correctamente
    });

    const results = [];
    const linkRegex =
      /<a[^>]*class=["']?result__a["']?[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
    let match;
    while ((match = linkRegex.exec(html)) && results.length < count) {
      const url = match[1];
      const title = match[2].replace(/<[^>]+>/g, "").trim();
      results.push({ title, url });
    }
    return results;
  } catch (err) {
    // logging simple — podés enriquecer según tu logger
    console.error("duckduckgoSearch error:", err?.message || err);
    throw err;
  }
}
