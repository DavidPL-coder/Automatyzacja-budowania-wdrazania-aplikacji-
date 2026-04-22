import express, { json } from "express";
import cors from "cors";
import { v4 } from "uuid";
import fs from "fs";

const app = express();
app.use(cors());
app.use(json());

const PORT = 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || v4();

const DATA_FILE = "/data/items.json";

function readItems() {
    if (!fs.existsSync(DATA_FILE)) 
        return [];
    
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveItems(items) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

app.get("/items", (req, res) => res.json(readItems()));

app.post("/items", (req, res) => {
    const items = readItems();

    const item = {
        id: v4(),
        name: req.body.name
    };

    items.push(item);
    saveItems(items);

    res.status(201).json(item);
});

app.get("/stats", (req, res) => {
    const items = readItems();

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
