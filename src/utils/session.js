import * as sessionService from "../services/session-service.js";

// Obtiene o crea un sessionId, setea la cookie y devuelve el ID
export default async function getSessionID(req, res) {
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    try {
      const session = await sessionService.createSessionAsync();
      // Suponemos que el repo devuelve { id }
      sessionId = session?.id || session;
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: false, // cambiar a true si usás HTTPS
        sameSite: "lax",
        maxAge: 31536000000, // ~1 año
      });
    } catch (e) {
      console.warn("getSessionID falló, creando hole sin persistencia de sesión:", e?.message || e);
    }
  }

  return sessionId;
}