const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Helper Function ---
// Finds an existing user or creates a new one for social logins.
async function findOrCreateUser(fastify, email) {
  const client = await fastify.db.connect();
  try {
    let result = await client.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      fastify.log.info(`Found existing user: ${email}`);
      return result.rows[0];
    }

    fastify.log.info(`User not found. Creating new user: ${email}`);
    const randomPassword = require('crypto').randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    result = await client.query(
      'INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}


// --- Main Plugin ---
// A standard async function. NO fastify-plugin wrapper.
async function authRoutes(fastify, options) {

  // --- GOOGLE OAUTH CALLBACK ---
  // This is the route that is failing.
  fastify.get('/google/callback', async function (request, reply) {
    try {
      const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request, reply);
      
      const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      if (!googleUserResponse.ok) {
        throw new Error('Failed to fetch user info from Google.');
      }

      const googleUser = await googleUserResponse.json();

      if (!googleUser.email) {
        return reply.code(500).send({ error: 'Failed to retrieve user email from Google.' });
      }

      const user = await findOrCreateUser(this, googleUser.email);

      const appToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      this.log.info(`Google OAuth successful for user: ${user.email}`);
      return reply.send({ token: appToken });

    } catch (err) {
      this.log.error('Google OAuth Callback Error:', err);
      return reply.code(500).send({ error: 'An internal server error occurred during Google OAuth.' });
    }
  });
  
  // --- REGISTER USER ROUTE ---
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await fastify.db.connect();
      try {
        const result = await client.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, email, created_at', [email, hashedPassword]);
        return reply.code(201).send(result.rows[0]);
      } finally {
        client.release();
      }
    } catch (err) {
      if (err.code === '23505') { return reply.code(409).send({ error: 'A user with this email already exists.' }); }
      fastify.log.error('Registration Error:', err);
      return reply.code(500).send({ error: 'An internal server error occurred.' });
    }
  });

  // --- LOGIN USER ROUTE ---
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required.' });
    }
    const client = await fastify.db.connect();
    try {
      const result = await client.query('SELECT id, email, hashed_password FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
        return reply.code(401).send({ error: 'Invalid credentials.' });
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return reply.send({ token });
    } catch (err) {
      fastify.log.error('Login Error:', err);
      return reply.code(500).send({ error: 'An internal server error occurred.' });
    } finally {
      client.release();
    }
  });
}

module.exports = authRoutes;