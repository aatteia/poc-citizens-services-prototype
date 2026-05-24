import type { ReactNode } from "react";

import { FlowProvider } from "@/lib/flow-context";

export default function CheckLayout({ children }: { children: ReactNode }) {
  return <FlowProvider>{children}</FlowProvider>;
}
