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
         const response = await axios.post("http://localhost:3001/api/upload",
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
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Processing..." : "Upload PDF"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UploadPdf;
