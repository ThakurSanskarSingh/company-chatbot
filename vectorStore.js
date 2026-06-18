import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
 });
 const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

 const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

 export async function storeChunks(chunks,documentId) {
    const documents = chunks.map((chunk) => ({
        pageContent: chunk,
        metadata: { documentId },
    }))

    await PineconeStore.fromDocuments(documents, embeddings, {
        pineconeIndex,
        namespace: documentId,
    })
    
 }

export async function retrieveRelevantChunks(query, documentId, k = 4) {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: documentId,
  });

  const results = await vectorStore.similaritySearch(query, k, {
    documentId,
  });

  return results;
}

