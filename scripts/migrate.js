// Load environment variables from the .env file in the project root
require('dotenv').config();

const { Pool } = require('pg');

// --- Diagnostic Check ---
console.log('--- Verifying Environment Variables ---');
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
if (!process.env.DB_PASSWORD) {
    console.error('FATAL ERROR: DB_PASSWORD is not defined. Check your .env file.');
    process.exit(1);
}
console.log('------------------------------------');
// ----------------------

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createUsersTableQuery = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

async function migrate() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to the database successfully.');

    await client.query(createUsersTableQuery);
    console.log('Migration successful: "users" table created or already exists.');

  } catch (err) {
    console.error('\n--- MIGRATION FAILED ---');
    console.error('Error during migration:', err.message);
    console.error('--------------------------\n');
  } finally {
    if (client) client.release();
    await pool.end();
    console.log('Database connection closed.');
  }
}

migrate();