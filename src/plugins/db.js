const fp = require('fastify-plugin');
const { Pool } = require('pg');

async function dbConnector(fastify, options) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await pool.connect();
    fastify.log.info('Database connection established successfully.');
  } catch (err) {
    fastify.log.error('Failed to connect to the database.', err);
    process.exit(1);
  }

  fastify.decorate('db', pool);

  fastify.addHook('onClose', (instance, done) => {
    instance.db.end(done);
  });
}

module.exports = fp(dbConnector);