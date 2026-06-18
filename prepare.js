import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function indexDocument(filePath) {
  const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  console.log("Extracted text length:", fullText.length);
console.log("First 200 chars:", fullText.substring(0, 200));

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await textSplitter.splitText(fullText);
  return chunks;
}
