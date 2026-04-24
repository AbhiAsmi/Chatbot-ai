import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generate } from "./chatbot.js";
const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "frontend")));
server.post("/chat", async function (req, res) {
    try {
        const { message, threadId } = req.body;

        const result = await generate(message, threadId);

        res.json({
            message: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

server.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});