import { Pool } from "pg";
import DBConfig from "../config/db-config.js";

const pool = new Pool(DBConfig);

export default class HoleRepository {
  async getCategoriesAsync() {
    const sql = "SELECT * FROM categories";
    const result = await pool.query(sql);
    return result.rows;
  }

  async createHoleAsync(sessionID) {
    const sql =
      "INSERT INTO holes (session_id) VALUES ($1) RETURNING id";
    const values = [sessionID];
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async getHoleAsync(sessionID, holeID) {
    const sql = "SELECT id, created_at, messages, public FROM holes WHERE id = $2 AND (public = true OR session_id = $1)";
    const values = [sessionID, holeID];
    const result = await pool.query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async updateMessagesAsync(holeID, messages) {
    const sql = "UPDATE holes SET messages = $2 WHERE id = $1";
    const values = [holeID, messages];
    await pool.query(sql, values);
  }
}
