import { Pool } from "pg";
import DBConfig from "../config/db-config.js";

const pool = new Pool(DBConfig);

export const getCategoriesAsync = async () => {
  const sql = "SELECT * FROM categories";
  const result = await pool.query(sql);
  return result.rows;
};

export const createHoleAsync = async (sessionId, categoryId) => {
  const sql =
    "INSERT INTO holes (session_id, category_id) VALUES ($1, $2) RETURNING id";
  const values = [sessionId, categoryId];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const getHoleAsync = async (sessionId, id) => {
  const sql = "SELECT * FROM holes WHERE id = $1";
  const values = [sessionId, id];
  const result = await pool.query(sql, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateMessagesAsync = async (id, messages) => {
  const sql = "UPDATE holes SET messages = $2 WHERE id = $1";
  const values = [id, messages];
  await pool.query(sql, values);
};
