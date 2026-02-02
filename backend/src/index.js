const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis!");
})();

pool.query(`
  CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('DB Init Error:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'active', service: 'backend' });
});

app.get('/api/data', async (req, res) => {
  try {
    await pool.query('INSERT INTO access_logs DEFAULT VALUES');
    const dbResult = await pool.query('SELECT COUNT(*) FROM access_logs');

    const cacheCount = await redisClient.incr('global_visits');

    res.json({ 
      message: "APIShield Protected Response",
      data_sources: {
        postgres_logs: parseInt(dbResult.rows[0].count), 
        redis_hits: cacheCount                           
      },
      secret: "super-secret-backend-data" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Storage error" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});