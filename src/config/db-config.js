import "dotenv/config";
let DBConfig;

if (process.env.DB_CONNECTION_STRING) {
  DBConfig = {
    connectionString: process.env.DB_CONNECTION_STRING,
  };
} else {
  DBConfig = {
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 5432,
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
  };
}

export default DBConfig;
