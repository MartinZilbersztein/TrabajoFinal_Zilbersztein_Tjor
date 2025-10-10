import { Pool } from "pg";
import DBConfig from "../config/db-config.js";

const pool = new Pool(DBConfig);

export default class HoleRepository {
  async getCategoriesAsync() {
    const sql = "SELECT * FROM categories";
    const result = await pool.query(sql);
    return result.rows;
  };

  async createHoleAsync(sessionId) {
    const sql =
      "INSERT INTO holes (session_id) VALUES ($1) RETURNING id";
    const values = [sessionId];
    const result = await pool.query(sql, values);
    return result.rows[0];
  };

  async getHoleAsync(sessionId, id) {
    const sql = "SELECT * FROM holes WHERE id = $1";
    const values = [sessionId, id];
    const result = await pool.query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  };

  async updateMessagesAsync(id, messages) {
    const sql = "UPDATE holes SET messages = $2 WHERE id = $1";
    const values = [id, messages];
    await pool.query(sql, values);
  };
}

