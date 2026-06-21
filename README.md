# AskMyDocs — Dynamic PDF RAG Chatbot

Upload any PDF and instantly chat with it. AskMyDocs parses your document, embeds it, and uses Retrieval-Augmented Generation (RAG) to answer questions grounded strictly in the uploaded content — no hallucinated answers, no generic responses.

**Live demo:** [https://ask-my-docs.vercel.app](https://ask-my-docs-one.vercel.app/)
**Backend API:** https://askmydocs-7mad.onrender.com

---

## Features

- **Dynamic PDF upload** — any user can upload any PDF at runtime, no hardcoded documents
- **Session-isolated retrieval** — each uploaded document gets a unique ID; questions only ever retrieve from that specific document, even with multiple concurrent users
- **Grounded answers** — the LLM is explicitly instructed to answer only from retrieved context, and to say so when an answer isn't in the document
- **Full RAG pipeline** — parsing, chunking, embedding, vector storage, semantic retrieval, and generation, all built from scratch

## Tech Stack

**Frontend**
- React (Vite)
- Axios

**Backend**
- Node.js, Express
- Multer (file upload handling)
- LangChain.js (orchestration)
- pdfjs-dist (PDF parsing)

**AI / Infrastructure**
- Google Gemini (`gemini-embedding-001`) — embeddings
- Groq (`llama-3.3-70b-versatile`) — answer generation
- Pinecone — vector database

**Deployment**
- Frontend: Vercel
- Backend: Render

## Architecture

```
User uploads PDF
      │
      ▼
Express /api/upload route (Multer)
      │
      ▼
Parse PDF (pdfjs-dist) → extract raw text
      │
      ▼
Chunk text (RecursiveCharacterTextSplitter)
      │
      ▼
Embed each chunk (Gemini embeddings)
      │
      ▼
Store vectors in Pinecone, tagged with a unique documentId
      │
      ▼
User asks a question with that documentId
      │
      ▼
Embed the question → similarity search in Pinecone (filtered by documentId)
      │
      ▼
Retrieved chunks + question → Groq LLM (grounded system prompt)
      │
      ▼
Answer returned to user
```

## Key Design Decisions

**Why session isolation via metadata filtering, not separate indexes.**
Every chunk is tagged with the document's unique ID at storage time. Retrieval queries filter by this ID, so multiple users' documents safely coexist in a single Pinecone index without ever leaking into each other's answers.

**Why the system prompt explicitly restricts the LLM to provided context.**
Without this constraint, the model will answer from its own general knowledge even when the retrieved chunks don't contain the answer — defeating the purpose of RAG. The prompt explicitly instructs the model to say "I couldn't find that information in the document" when appropriate.

**Why Groq for generation but Gemini for embeddings.**
Groq offers fast, free-tier LLM inference for chat completions but does not currently provide an embeddings endpoint. Gemini's free tier fills that specific gap.

## Running Locally

**Backend**
```bash
cd company-chatbot
npm install
# create a .env file with GROQ_API_KEY, GOOGLE_API_KEY, PINECONE_API_KEY, PINECONE_INDEX_NAME
node server.js
```

**Frontend**
```bash
cd company-chatbot/rag-frontend
npm install
# create a .env file with VITE_API_URL=http://localhost:3001
npm run dev
```

## API Reference

**POST `/api/upload`**
Accepts a `multipart/form-data` request with a `pdf` field.
Returns:
```json
{
  "documentId": "uuid",
  "fileName": "string",
  "totalChunks": "number",
  "message": "string"
}
```

**POST `/api/query`**
Accepts JSON: `{ "question": "string", "documentId": "string" }`
Returns:
```json
{
  "answer": "string",
  "sourcesUsed": "number"
}
```

## Known Limitations

- In-memory document metadata resets if the backend restarts (chunks themselves persist in Pinecone, but the original filename mapping does not)
- No conversational memory across turns yet — each question is answered independently
- Free-tier Render backend spins down after inactivity, causing a cold-start delay (30–60s) on the first request after idle time

## Future Improvements

- Multi-turn conversational memory per document session
- Support for additional file types (DOCX, TXT)
- Streaming responses for faster perceived latency
- Source citation showing which page/chunk an answer came from
