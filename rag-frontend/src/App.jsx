import { useState } from "react";
import UploadPdf from "./components/UploadPdf";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  const [document, setDocument] = useState(null);

  return (
    <main className="app-shell">
      <header className="terminal-bar">
        <span className="terminal-bar__title">PDF_INSIGHT // RAG_TERMINAL</span>
        <span className="terminal-bar__path" aria-hidden="true">~/knowledge-base</span>
        <span className="terminal-bar__status"><span className="status-dot" /> SYSTEM ONLINE</span>
      </header>

      <div className="dashboard">
        <section className="workspace">
          <p className="eyebrow">root@insight:~$ initialize document interface</p>
          <h1 className="hero-title">Query the source</h1>
          <p className="hero-copy">
            Securely index a PDF, then interrogate its contents through a focused
            <strong> retrieval-augmented interface</strong>.
          </p>

          {!document ? (
            <div className="terminal-panel">
              <div className="terminal-panel__header">
                <span>+-- INPUT_CHANNEL_01</span>
                <span>[AWAITING FILE]</span>
              </div>
              <div className="terminal-panel__body">
                <UploadPdf onUpload={setDocument} />
              </div>
            </div>
          ) : (
            <div>
              <div className="document-meta">
                <span><span className="meta-label">ACTIVE_FILE // </span><strong>{document.fileName}</strong></span>
                <span><span className="meta-label">VECTORS // </span><strong>{document.totalChunks} CHUNKS</strong></span>
              </div>
              <ChatBox documentId={document.documentId} />
              <button className="terminal-button terminal-button--secondary" onClick={() => setDocument(null)}>
                [ DISCONNECT FILE / UPLOAD ANOTHER ]
              </button>
            </div>
          )}
        </section>

        <aside className="system-rail" aria-label="System information">
          <div className="system-rail__block">
            <span className="panel-label">// STATUS</span>
            <span className="system-rail__value">[OK] CORE_READY</span>
            <span>[OK] VECTOR_LINK</span>
            <span>[OK] LLM_CHANNEL</span>
          </div>
          <div className="system-rail__block">
            <span className="panel-label">// MEMORY</span>
            <span className="progress" aria-label="Memory capacity 72 percent">[|||||||||||....]</span>
            <span>72% AVAILABLE</span>
          </div>
          <div className="system-rail__block">
            <span className="panel-label">// PROTOCOL</span>
            <span>PDF / SEMANTIC</span>
            <span>LOCAL PORT :3001</span>
          </div>
          <p className="system-rail__footer">v1.0.0<br />NO DATA PERSISTS IN UI SESSION</p>
        </aside>
      </div>
    </main>
  );
}

export default App;
