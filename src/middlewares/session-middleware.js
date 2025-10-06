import * as userService from "../services/user-service.js";

export default async function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    const sessionId = await userService.createSessionAsync();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 31536000000,
    }); // 1 año
  }

  req.sessionId = sessionId;
  next();
}
