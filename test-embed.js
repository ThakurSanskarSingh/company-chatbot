import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

console.log("Key check:", process.env.GOOGLE_API_KEY?.substring(0, 10));

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
  outputDimensionality: 768,
});

const result = await embeddings.embedQuery("hello world");
console.log("Length:", result.length);