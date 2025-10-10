import { Pool } from "pg";
import DBConfig from "../config/db-config.js";

const pool = new Pool(DBConfig);

export const createSessionAsync = async () => {
  const sql = "INSERT INTO sessions DEFAULT VALUES RETURNING id";
  const result = await pool.query(sql);
  return result.rows[0];
};
