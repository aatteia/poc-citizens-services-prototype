/**
 * Page metadata strip — "Page last updated" + QC quality-code reference.
 * Sits just above the footer; matches servicesaustralia.gov.au pages.
 *
 * Both values are static for the prototype.
 */
interface PageMetaProps {
  lastUpdated: string;
  qcReference: string;
  className?: string;
}

export function PageMeta({
  lastUpdated,
  qcReference,
  className,
}: PageMetaProps) {
  return (
    <div className={["page-meta", className].filter(Boolean).join(" ")}>
      <p className="page-meta__updated">
        Page last updated: <time>{lastUpdated}</time>
      </p>
      <p className="page-meta__qc">{qcReference}</p>
    </div>
  );
}
