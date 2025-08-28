import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api.js";
import FolderTree from "../components/FolderTree.jsx";
import UploadForm from "../components/UploadForm.jsx";
import ImageGrid from "../components/ImageGrid.jsx";
import Breadcrumbs from "../components/BreadCrumbs.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentFolder, setCurrentFolder] = useState(null); // null = root
  const [path, setPath] = useState([]);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (folderId = null, opts = { keepQuery: false }) => {
    setLoading(true);
    setCurrentFolder(folderId);
    try {
      const [fRes, iRes] = await Promise.all([
        api.get("/api/folders", { params: { parentId: folderId } }),
        api.get("/api/images", { params: { folderId } }),
      ]);
      setFolders(fRes.data);
      setImages(iRes.data);

      if (folderId) {
        const { data } = await api.get(`/api/folders/path/${folderId}`);
        setPath(data);
      } else {
        setPath([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    await api.post("/api/folders", {
      name: newFolderName.trim(),
      parentId: currentFolder,
    });
    setNewFolderName("");
    load(currentFolder);
  };

  const onSearch = async (q) => {
    if (!q) return load(currentFolder);
    const { data } = await api.get("/api/images/search", { params: { q } });
    setImages(data);
  };

  return (
    <div className="layout">
      <aside>
        <div className="brand">DriveBox</div>
        <div className="user">{user?.name}</div>
        <FolderTree onOpen={(id) => load(id)} />
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main>
        <Breadcrumbs
          path={path}
          onNavigateRoot={() => load(null)}
          onNavigateTo={(id) => load(id)}
        />

        <div className="toolbar">
          <SearchBar onSearch={onSearch} />
          <div className="new-folder">
            <input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button onClick={createFolder}>Create</button>
          </div>
        </div>

        <UploadForm
          folderId={currentFolder}
          onUploaded={() => load(currentFolder)}
        />

        {loading ? (
          <div className="muted">Loading…</div>
        ) : (
          <>
            <section>
              <h3>Folders</h3>
              <div className="folders">
                {folders.length === 0 && (
                  <div className="muted">No folders here.</div>
                )}
                {folders.map((f) => (
                  <div
                    key={f._id}
                    className="folder link"
                    onClick={() => load(f._id)}
                  >
                    📁 {f.name}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3>Images</h3>
              <ImageGrid images={images} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
