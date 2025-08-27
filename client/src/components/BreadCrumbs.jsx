export default function Breadcrumbs({ path, onNavigateRoot, onNavigateTo }) {
  return (
    <div className="breadcrumbs">
      <span className="crumb link" onClick={onNavigateRoot}>
        Root
      </span>
      {path.map((p, idx) => (
        <span key={p.id}>
          <span> / </span>
          <span className="crumb link" onClick={() => onNavigateTo(p.id)}>
            {p.name}
          </span>
        </span>
      ))}
    </div>
  );
}
