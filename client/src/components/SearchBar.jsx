import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div className="search">
      <input
        placeholder="Search my images by name…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button onClick={() => onSearch(q)}>Search</button>
    </div>
  );
}
