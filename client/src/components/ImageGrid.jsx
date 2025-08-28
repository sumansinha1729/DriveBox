export default function ImageGrid({ images }) {
  if (!images?.length) return <div className="muted">No images here yet.</div>;
  return (
    <div className="grid">
      {images.map((img) => (
        <div key={img._id} className="card">
          <img src={img.url} alt={img.name} />
          <div className="caption">{img.name}</div>
        </div>
      ))}
    </div>
  );
}
