import "dotenv/config";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateAnswer(question, context) {
  const userQuery = `Question: ${question}\n\nRelevant Context: ${context}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { 
        role: "system", 
        content: "You are a helpful assistant that answers questions based ONLY on the provided context. If the answer cannot be found in the context, say 'I couldn't find that information in the document.'" 
      },
      { role: "user", content: userQuery },
    ],
    temperature: 0,
  });

  return response.choices[0].message.content;
}
