import type { ReactNode } from "react";

interface FactBoxProps {
  title?: string;
  children: ReactNode;
}

/**
 * Light blue tinted box with a 4px left navy border.
 * Used on the overview key-facts panel and on the eligible result payment range.
 */
export function FactBox({ title, children }: FactBoxProps) {
  return (
    <aside className="fact-box">
      {title && <h2 className="fact-box__title">{title}</h2>}
      <div className="fact-box__body">{children}</div>
    </aside>
  );
}

interface FactBoxItemProps {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
}

export function FactBoxItem({ label, value, caption }: FactBoxItemProps) {
  return (
    <div className="fact-box__item">
      <dt className="fact-box__item-label">{label}</dt>
      <dd className="fact-box__item-value">{value}</dd>
      {caption && <p className="fact-box__item-caption">{caption}</p>}
    </div>
  );
}

interface FactBoxListProps {
  children: ReactNode;
}

export function FactBoxList({ children }: FactBoxListProps) {
  return <dl className="fact-box__list">{children}</dl>;
}
