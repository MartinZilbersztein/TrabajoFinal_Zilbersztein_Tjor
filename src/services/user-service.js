import jwt from "jsonwebtoken";
import { JWTOptions, JWTSecretKey } from "../config/jwt-config.js";
import * as userRepository from "../repositories/user-repository.js";

export const createSessionAsync = async () => {
  const session = await userRepository.createSessionAsync();
  const jwtToken = jwt.sign(session, JWTSecretKey, JWTOptions);
  return jwtToken;
};
