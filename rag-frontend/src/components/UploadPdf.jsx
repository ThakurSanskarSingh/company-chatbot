import {useState} from "react";
import axios from "axios";


function UploadPdf({onUpload}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  }

    const handleUpload = async () => {
        if(!file) {
          setError("Please select a file to upload");
          return;
        }
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("pdf", file);

        try {
         const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`,
            formData, {
                headers : {"Content-Type": "multipart/form-data"}
            });
            onUpload({
                documentId: response.data.documentId,
                fileName: response.data.fileName,
                totalChunks: response.data.totalChunks,
            });
        } catch (err) {
            setError("Failed to upload document. Please try again.");
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="upload-zone">
            <input className="file-input" id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} />
      <label className="file-drop" htmlFor="pdf-file">
        <span>
          <span className="file-drop__icon" aria-hidden="true">[ + ]</span>
          SELECT PDF FROM LOCAL FILESYSTEM
          <span className="file-drop__hint">accepted_format: .pdf // single_document</span>
        </span>
      </label>
      {file && (
        <div className="selected-file" aria-live="polite">
          <span>[FILE DETECTED]</span>
          <span>{file.name}</span>
        </div>
      )}
      <button className="terminal-button" onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "[ INDEXING DOCUMENT... ]" : "[ INITIATE UPLOAD ]"}
      </button>
      {error && <p className="error-message" role="alert">[ERR] {error}</p>}
    </div>
  );
}

export default UploadPdf;
