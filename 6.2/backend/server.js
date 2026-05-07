import express from "express";
import pkg from "pg";
import redis from "redis";

const { Pool } = pkg;

const PORT = 3000;

const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`
});

await client.connect();

let cacheHits = 0;

await pool.query(`
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0
);
`);

app.get("/items", async (req, res) => {
    const cached = await client.get("items");

    if (cached) {
        cacheHits++;
        return res.json(JSON.parse(cached));
    }

    const result = await pool.query("SELECT * FROM products");

    await client.setEx("items", 30, JSON.stringify(result.rows));

    res.json(result.rows);
});

app.post("/items", async (req, res) => {
    const { name, price } = req.body;

    const result = await pool.query(
        "INSERT INTO products(name, price) VALUES($1, $2) RETURNING *",
        [name, price]
    );

    await client.del("items");

    res.status(201).json(result.rows[0]);
});

app.get("/stats", async (req, res) => {
    const result = await pool.query("SELECT COUNT(*) FROM products");

    res.json({
        count: parseInt(result.rows[0].count),
        cache_hits: cacheHits
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});