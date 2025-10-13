import * as sessionRepository from "../repositories/session-repository.js";

export const createSessionAsync = async () => {
  const session = await sessionRepository.createSessionAsync();
  return session;
};
