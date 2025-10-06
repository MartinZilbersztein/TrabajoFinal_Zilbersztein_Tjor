import "dotenv/config";

export const JWTSecretKey = process.env.JWT_SECRET_KEY;
export const JWTOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};
