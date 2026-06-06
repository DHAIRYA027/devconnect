// Shimmer placeholder shown while posts load — feels faster than a spinner.
export default function PostSkeleton() {
  return (
    <div className="card">
      <div className="sk-row">
        <div className="skeleton" style={{ width: 42, height: 42, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton sk-line" style={{ width: "30%", marginBottom: 8 }} />
          <div className="skeleton sk-line" style={{ width: "20%" }} />
        </div>
      </div>
      <div className="skeleton sk-line" style={{ width: "95%", marginBottom: 8 }} />
      <div className="skeleton sk-line" style={{ width: "80%" }} />
    </div>
  );
}
