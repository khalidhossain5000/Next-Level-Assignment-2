import { Pool } from "pg";
import configuration from "../config/config";

export const pool = new Pool({
  connectionString: configuration.connectionString,
});

const main = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(30) DEFAULT 'contributor' CHECK(role IN('contributor','maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        //issues TABLE CREATE HERE

        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
              id SERIAL PRIMARY KEY,
              title VARCHAR(150) NOT NULL,
              description TEXT NOT NULL CHECK(char_length(description)>=20),
              type VARCHAR(20) CHECK(type IN('bug','feature_request')),
              status VARCHAR(30) DEFAULT 'open' CHECK(status IN('open','in_progress','resolved')),
              reporter_id INT NOT NULL,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()

            )
        `)
        console.log("Database connected successfully and table created")
  } catch (error) {
    console.log(error,'error in db conection')
  }
};

export default main;
