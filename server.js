import "dotenv/config";
import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { indexDocument } from "./prepare.js";
import { retrieveRelevantChunks, storeChunks } from "./vectorStore.js";
import { generateAnswer } from "./llm.js";


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});


app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const documentId = uuidv4();
    const chunks = await indexDocument(req.file.buffer);
    await storeChunks(chunks, documentId);

    res.json({
      documentId,
      fileName: req.file.originalname,
      totalChunks: chunks.length,
      message: "Document processed and indexed successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process document" });
  }
});

app.post("/api/query", async (req, res) => {
  try {
    const { question, documentId } = req.body;
    if (!question || !documentId) {
      return res.status(400).json({ error: "Missing question or documentId" });
    }
    const relevantChunks = await retrieveRelevantChunks(question, documentId);

    const context = relevantChunks.map((chunk) => chunk.pageContent).join("\n");

    const answer = await generateAnswer(question, context);
    res.json({
      answer,
      sourcesUsed: relevantChunks.length
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
