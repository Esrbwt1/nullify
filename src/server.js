require('dotenv').config();
const fastify = require('fastify')({ logger: { transport: { target: 'pino-pretty' } } });
const authRoutes = require('./routes/auth/index'); // Correct path to the routes file

// --- PRE-FLIGHT CHECKS ---
const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);
if (missingEnv.length > 0) {
  console.error('FATAL ERROR: Missing required environment variables:', missingEnv);
  process.exit(1);
}
// --- END PRE-FLIGHT CHECKS ---

const start = async () => {
  try {
    // Register DB
    await fastify.register(require('./plugins/db'));
    
    // Register OAuth2
    await fastify.register(require('@fastify/oauth2'), {
      name: 'googleOAuth2',
      scope: ['profile', 'email'],
      credentials: {
        client: { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET },
        auth: require('@fastify/oauth2').GOOGLE_CONFIGURATION
      },
      startRedirectPath: '/auth/google', // The server will create this route for you
      callbackUri: `http://localhost:3001/auth/google/callback`
    });

    // Register our routes with a prefix
    await fastify.register(authRoutes, { prefix: '/auth' });

    fastify.get('/', (req, reply) => reply.send({ status: 'OK' }));

    const port = process.env.PORT || 3001;
    await fastify.listen({ port: parseInt(port, 10), host: '0.0.0.0' });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();