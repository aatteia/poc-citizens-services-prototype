import Link from "next/link";

interface RelatedPaymentCardProps {
  title: string;
  description: string;
  href: string;
}

export function RelatedPaymentCard({
  title,
  description,
  href,
}: RelatedPaymentCardProps) {
  return (
    <Link href={href} className="related-card">
      <h3 className="related-card__title">{title}</h3>
      <p className="related-card__description">{description}</p>
      <span className="related-card__cta">
        Find out more
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 7h8M7 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
