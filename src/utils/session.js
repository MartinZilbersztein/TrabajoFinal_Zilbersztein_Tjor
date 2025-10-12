import * as sessionService from "../services/session-service.js";

// Obtiene o crea un sessionID, setea la cookie y devuelve el ID
export default async function getSessionID(req, res) {
  let sessionID = req.cookies?.sessionID;

  if (!sessionID) {
    try {
      const session = await sessionService.createSessionAsync();
      // Suponemos que el repo devuelve { id }
      sessionID = session?.id || session;
      res.cookie("sessionID", sessionID, {
        httpOnly: true,
        secure: false, // cambiar a true si usás HTTPS
        sameSite: "lax",
        maxAge: 31536000000, // ~1 año
      });
    } catch (e) {
      sessionID = null;
      console.warn("getSessionID falló, creando hole sin persistencia de sesión:", e?.message || e);
    }
  }

  return sessionID;
}
