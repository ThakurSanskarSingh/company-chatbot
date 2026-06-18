import { useState } from "react";
import UploadPdf from "./components/UploadPdf";
import ChatBox from "./components/ChatBox";

function App() {
  const [document, setDocument] = useState(null);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>PDF Insight Chat</h1>

      {!document ? (
        <UploadPdf onUpload={setDocument} />
      ) : (
        <div>
          <p>
            Chatting with: <strong>{document.fileName}</strong> ({document.totalChunks} chunks indexed)
          </p>
          <ChatBox documentId={document.documentId} />
          <button onClick={() => setDocument(null)}>Upload a different PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
