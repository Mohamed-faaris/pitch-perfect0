export function TurfHighlights() {
  const highlights = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="bg-card rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Turf Highlights</h2>
      <div className="grid grid-cols-3 gap-2">
        {highlights.map((i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">Photo {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}