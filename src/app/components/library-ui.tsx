/**
 * Presentational layout helpers for the Design system page. Plain (no
 * client hooks, no server-only APIs) so they can be rendered from both
 * the server page and the small client module that hosts the demos which
 * can't cross the server/client boundary (see checklist-group-demo.tsx).
 */

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="library__section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="library__section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Grid({
  cols,
  children,
}: {
  cols: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className="library__grid" data-cols={cols}>
      {children}
    </div>
  );
}

export function Tile({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`library__tile${wide ? " library__tile--wide" : ""}`}>
      <p className="library__tile-label">{label}</p>
      <div className="library__tile-body">{children}</div>
    </div>
  );
}
