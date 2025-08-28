import { useState } from "react";
import api from "../api.js";

export default function UploadForm({ folderId, onUploaded }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name) return setError("Name and image are required");
    setError("");
    setBusy(true);

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (folderId) fd.append("folderId", folderId);
      fd.append("image", file);

      await api.post("/api/images/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setFile(null);
      onUploaded?.();
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="upload" onSubmit={onSubmit}>
      <input
        placeholder="Image name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button disabled={busy || !file || !name.trim()}>
        {busy ? "Uploading…" : "Upload"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
