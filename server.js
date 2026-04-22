import express from "express";
import cors from "cors";
import { generate } from "./chatbot.js";

const server = express();

// ✅ enable CORS
server.use(cors());

server.use(express.json());

server.get("/", function (req, res) {
    res.send("Welcome to my personal chatGPT!");
});

server.post("/chat", async function (req, res) {
    const { message, threadId } = req.body;

    const result = await generate(message, threadId);

    res.json({
        message: result,
    });
});

server.listen(3000, function () {
    console.log("server is running at the port number 3000");
});