import express, { json } from "express";
import cors from "cors";
import { v4 } from "uuid";

const app = express();
app.use(cors());
app.use(json());

const PORT = 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || v4();

let items = [];

app.get("/items", (req, res) => res.json(items));

app.post("/items", (req, res) => {
    const item = {
        id: v4(),
        name: req.body.name
    };
    items.push(item);
    res.status(201).json(item);
});

app.get("/stats", (req, res) => {
    res.json({
        count: items.length,
        instance: INSTANCE_ID
    });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Instance id: ${INSTANCE_ID}`);
});