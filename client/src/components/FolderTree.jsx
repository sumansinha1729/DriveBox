import { useEffect, useState } from "react";
import api from "../api";

function Node({ folder, loadChildren, onOpen }) {
  const [kids, setKids] = useState([]);
  const [open, setOpen] = useState(false);

  const toggle = async () => {
    if (!open) {
      const res = await loadChildren(folder._id);
      setKids(res);
    }
    setOpen(!open);
  };

  return (
    <div className="node">
      <div className="node-row">
        <button onClick={toggle}>{open ? "▾" : "▸"}</button>
        <span className="link" onClick={() => onOpen(folder._id)}>
          {folder.name}
        </span>
      </div>
      {open && (
        <div className="node-children">
          {kids.map((f) => (
            <Node
              key={f._id}
              folder={f}
              loadChildren={loadChildren}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({ onOpen }) {
  const [roots, setRoots] = useState([]);

  const loadChildren = async (parentId) => {
    const { data } = await api.get("/api/folders", { params: { parentId } });
    return data;
  };

  useEffect(() => {
    loadChildren(null).then(setRoots);
  }, []);

  return (
    <div className="tree">
      {roots.map((f) => (
        <Node
          key={f._id}
          folder={f}
          loadChildren={loadChildren}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
