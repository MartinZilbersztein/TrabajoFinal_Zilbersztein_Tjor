// src/repositories/hole-repository.js
let holes = [];
let categories = [
  { id: 1, name: "Ciencia" },
  { id: 2, name: "Historia" },
  { id: 3, name: "Tecnología" }
];

export const createHoleAsync = async (sessionId, categoryId) => {
  const hole = { id: holes.length + 1, categoryId, messages: [] };
  holes.push(hole);
  return hole;
};

export const getHoleAsync = async (sessionId, id) => {
  return holes.find(h => h.id === parseInt(id));
};

export const updateMessagesAsync = async (id, messages) => {
  const hole = holes.find(h => h.id === parseInt(id));
  if (hole) hole.messages = messages;
};

export const getCategoriesAsync = async () => categories;


/* --------------------------------------------
   Código original para PostgreSQL (comentado)
-------------------------------------------- */
// import pool from "../config/db.js";

// export const createHoleAsync = async (sessionId, categoryId) => {
//   // DB logic aquí
// };

// export const getHoleAsync = async (sessionId, id) => {
//   // DB logic aquí
// };

// export const updateMessagesAsync = async (id, messages) => {
//   // DB logic aquí
// };

// export const getCategoriesAsync = async () => {
//   // DB logic aquí
// };
